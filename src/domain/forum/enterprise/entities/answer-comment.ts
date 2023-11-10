import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Optional } from "src/core/types/optional";

import { Comment, CommentProps } from "./comment";

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }

  public static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return answerComment;
  }
}
