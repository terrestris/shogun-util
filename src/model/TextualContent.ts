import BaseEntity, { BaseEntityArgs } from './BaseEntity';

export interface TextualContentsArgs extends BaseEntityArgs {
  title?: string;
  markdown?: string;
  category?: string;
}

export default class TextualContent extends BaseEntity {
  title?: string;
  markdown?: string;
  category?: string;

  constructor({
    id,
    title,
    created,
    modified,
    markdown,
    category
  }: TextualContentsArgs) {
    super({
      id,
      created,
      modified
    });

    this.title = title;
    this.markdown = markdown;
    this.category = category;
  }
}
