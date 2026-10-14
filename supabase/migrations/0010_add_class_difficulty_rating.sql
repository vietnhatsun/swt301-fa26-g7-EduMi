ALTER TABLE public.teaching_classes
  ADD COLUMN IF NOT EXISTS difficulty VARCHAR(40) NOT NULL DEFAULT 'Trung bình',
  ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_teaching_classes_difficulty ON public.teaching_classes(difficulty);
