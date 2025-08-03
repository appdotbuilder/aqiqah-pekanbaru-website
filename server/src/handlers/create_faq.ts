
import { db } from '../db';
import { faqsTable } from '../db/schema';
import { type CreateFAQInput, type FAQ } from '../schema';

export const createFAQ = async (input: CreateFAQInput): Promise<FAQ> => {
  try {
    // Insert FAQ record
    const result = await db.insert(faqsTable)
      .values({
        question: input.question,
        answer: input.answer,
        category: input.category,
        display_order: input.display_order
      })
      .returning()
      .execute();

    // Return the created FAQ
    const faq = result[0];
    return faq;
  } catch (error) {
    console.error('FAQ creation failed:', error);
    throw error;
  }
};
