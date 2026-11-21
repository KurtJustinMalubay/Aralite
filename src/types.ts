export type UiLang='ceb'|'tl'|'en'
export interface ProfileRow {
  id:string; name:string; role:'student'|'teacher'; grade_level:string; avatar_bg:string; avatar_emoji:string;
  preferred_lang:UiLang; username?:string|null; password?:string|null; school_name?:string|null; section_name?:string|null
}
export interface LessonRow {
  id:string; subject:string; grade_level:string; deped_code:string; slm_reference:string;
  title_en:string; title_ceb:string; summary_en:string; summary_ceb:string;
  title_tl?:string; summary_tl?:string;
  size_kb:number; is_downloaded:number; order_index:number
}
export interface BlockRow {
  id:string; lesson_id:string; step_order:number; heading_en:string; heading_ceb:string;
  body_en:string; body_ceb:string; svg_type:string
  heading_tl?:string; body_tl?:string
}
export interface QuizRow {
  id:string; lesson_id:string; question_order:number; question_en:string; question_ceb:string;
  options_en_json:string; options_ceb_json:string; correct_index:number; explanation_en:string; explanation_ceb:string
  question_tl?:string; options_tl_json?:string; explanation_tl?:string
}
