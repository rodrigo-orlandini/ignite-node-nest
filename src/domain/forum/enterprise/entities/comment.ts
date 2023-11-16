import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface CommentProps {
  content: string;
  authorId: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get authorId() {
    return this.props.authorId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
