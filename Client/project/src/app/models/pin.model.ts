export interface Pin {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  userId?: number;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  createdAt?: Date;
  likesCount?: number;
  isLiked?: boolean;
  commentsCount?: number;
  comments?: Comment[];
}

export interface PinHelper {
  title: string;
  description: string;
}

export interface Comment {
  id?: number;
  text: string;
  pinId: number;
  userId?: number;
  userName?: string;
  createdAt?: Date;
}

export interface CommentCreateDto {
  text: string;
  pinId: number;
}