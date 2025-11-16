const base: string = process.env.BASE_URL ?? '';
export const URL_IMAGE_ROOT = base + "images";
export const URL_GOAL = base + "api/goal/{id}";
export const URL_GOAL_PROGRESS = base + "api/goal/{id}/progress";
export const URL_GOAL_PROGRESS_TYPES = base + "api/goal/{id}/progress-types";
export const URL_ADD_PROGRESS = base + "api/progress/add";
export const URL_UPDATE_PROGRESS = base + "api/progress/update/{id}";
