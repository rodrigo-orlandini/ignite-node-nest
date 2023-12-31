import { PaginationParams } from "src/core/repositories/pagination-params";

import { QuestionComment } from "src/domain/forum/enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "src/domain/forum/application/repositories/question-comments-repository";
import { CommentWithAuthor } from "src/domain/forum/enterprise/entities/value-objects/comment-with-author";

import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: QuestionComment[] = [];

  public async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  public async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  public async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  public async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  public async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error("Author doesn't exists");
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          authorName: author.name,
        });
      });

    return questionComments;
  }
}
