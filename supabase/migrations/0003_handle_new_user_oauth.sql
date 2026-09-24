-- ==============================================================================
-- EduMi (HIPZI) - Database Migration: 0003_handle_new_user_oauth.sql
-- Mô tả: Trigger tự động đồng bộ người dùng từ auth.users (Google OAuth)
--        sang public.users và tạo hồ sơ student_profiles với mã học sinh.
--        Đã tối ưu: SET search_path = public, EXCEPTION handling, đồng bộ ID.
-- ==============================================================================

-- 1. Đảm bảo function sinh mã học sinh chạy đúng trong schema public
CREATE OR REPLACE FUNCTION public.generate_unique_student_code()
RETURNS VARCHAR 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_code VARCHAR(32);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Sinh mã định dạng: EDM + 6 số ngẫu nhiên
        new_code := 'EDM-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        SELECT EXISTS (SELECT 1 FROM public.student_profiles WHERE student_code = new_code) INTO code_exists;
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$;

-- 2. Function xử lý user mới từ OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_full_name VARCHAR(255);
    v_avatar_url TEXT;
    v_student_code VARCHAR(32);
    v_existing_id UUID;
    v_password_hash VARCHAR(255);
BEGIN
    -- Trích xuất thông tin họ tên từ Google metadata
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Trích xuất ảnh đại diện từ Google
    v_avatar_url := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        NULL
    );

    -- Kiểm tra xem email đã tồn tại trong public.users chưa
    SELECT id, password_hash INTO v_existing_id, v_password_hash FROM public.users WHERE email = NEW.email LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
        -- Nếu tài khoản này đã được tạo bằng mật khẩu thông thường (password_hash IS NOT NULL),
        -- thì CHẶN không cho phép liên kết hoặc ghi đè bằng Google OAuth
        IF v_password_hash IS NOT NULL THEN
            RAISE EXCEPTION 'Email % đã được đăng ký bằng tài khoản mật khẩu thông thường. Vui lòng đăng nhập bằng Email và Mật khẩu.', NEW.email;
        END IF;

        -- Nếu đã có tài khoản trước đó với email này nhưng khác ID (do chưa đồng bộ):
        -- Ta đồng bộ ID về đúng NEW.id của auth.users để auth.uid() khớp với session đăng nhập
        IF v_existing_id <> NEW.id THEN
            DELETE FROM public.student_profiles WHERE user_id = v_existing_id;
            DELETE FROM public.parent_student_links WHERE student_id = v_existing_id OR parent_id = v_existing_id;
            DELETE FROM public.teacher_profiles WHERE user_id = v_existing_id;
            DELETE FROM public.users WHERE id = v_existing_id;

            INSERT INTO public.users (
                id,
                email,
                full_name,
                avatar_url,
                role,
                status,
                is_verified,
                created_at,
                updated_at
            ) VALUES (
                NEW.id,
                NEW.email,
                v_full_name,
                v_avatar_url,
                'student'::public.user_role,
                'active'::public.account_status,
                TRUE,
                NOW(),
                NOW()
            );

            v_student_code := public.generate_unique_student_code();

            INSERT INTO public.student_profiles (
                user_id,
                student_code,
                current_streak,
                longest_streak,
                total_points,
                created_at,
                updated_at
            ) VALUES (
                NEW.id,
                v_student_code,
                0,
                0,
                0,
                NOW(),
                NOW()
            )
            ON CONFLICT (user_id) DO NOTHING;
        ELSE
            -- ID đã khớp -> Cập nhật trạng thái
            UPDATE public.users
            SET 
                is_verified = TRUE,
                status = 'active'::public.account_status,
                avatar_url = COALESCE(public.users.avatar_url, v_avatar_url),
                updated_at = NOW()
            WHERE id = v_existing_id;
        END IF;
    ELSE
        -- Người dùng mới hoàn toàn -> Thêm vào public.users
        INSERT INTO public.users (
            id,
            email,
            full_name,
            avatar_url,
            role,
            status,
            is_verified,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            v_full_name,
            v_avatar_url,
            'student'::public.user_role,
            'active'::public.account_status,
            TRUE,
            NOW(),
            NOW()
        );

        -- Sinh mã học sinh ngẫu nhiên (EDM-xxxxxx) và tạo hồ sơ student_profiles
        v_student_code := public.generate_unique_student_code();

        INSERT INTO public.student_profiles (
            user_id,
            student_code,
            current_streak,
            longest_streak,
            total_points,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            v_student_code,
            0,
            0,
            0,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Bắt mọi ngoại lệ để không bao giờ làm gián đoạn transaction của Supabase Auth
    RAISE WARNING 'Lỗi trong handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Gắn Trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
