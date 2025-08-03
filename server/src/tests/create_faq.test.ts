
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { faqsTable } from '../db/schema';
import { type CreateFAQInput } from '../schema';
import { createFAQ } from '../handlers/create_faq';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateFAQInput = {
  question: 'What are your operating hours?',
  answer: 'We are open Monday to Friday from 9 AM to 6 PM.',
  category: 'General',
  display_order: 1
};

describe('createFAQ', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a FAQ', async () => {
    const result = await createFAQ(testInput);

    // Basic field validation
    expect(result.question).toEqual('What are your operating hours?');
    expect(result.answer).toEqual('We are open Monday to Friday from 9 AM to 6 PM.');
    expect(result.category).toEqual('General');
    expect(result.display_order).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save FAQ to database', async () => {
    const result = await createFAQ(testInput);

    // Query using proper drizzle syntax
    const faqs = await db.select()
      .from(faqsTable)
      .where(eq(faqsTable.id, result.id))
      .execute();

    expect(faqs).toHaveLength(1);
    expect(faqs[0].question).toEqual('What are your operating hours?');
    expect(faqs[0].answer).toEqual('We are open Monday to Friday from 9 AM to 6 PM.');
    expect(faqs[0].category).toEqual('General');
    expect(faqs[0].display_order).toEqual(1);
    expect(faqs[0].is_active).toEqual(true);
    expect(faqs[0].created_at).toBeInstanceOf(Date);
    expect(faqs[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create FAQ with null category', async () => {
    const inputWithNullCategory: CreateFAQInput = {
      question: 'How do I contact you?',
      answer: 'You can reach us via phone or WhatsApp.',
      category: null,
      display_order: 2
    };

    const result = await createFAQ(inputWithNullCategory);

    expect(result.question).toEqual('How do I contact you?');
    expect(result.answer).toEqual('You can reach us via phone or WhatsApp.');
    expect(result.category).toBeNull();
    expect(result.display_order).toEqual(2);
    expect(result.is_active).toEqual(true);

    // Verify in database
    const faqs = await db.select()
      .from(faqsTable)
      .where(eq(faqsTable.id, result.id))
      .execute();

    expect(faqs[0].category).toBeNull();
  });

  it('should create FAQ with zero display order', async () => {
    const inputWithZeroOrder: CreateFAQInput = {
      question: 'Do you offer custom packages?',
      answer: 'Yes, we can customize packages based on your needs.',
      category: 'Services',
      display_order: 0
    };

    const result = await createFAQ(inputWithZeroOrder);

    expect(result.display_order).toEqual(0);

    // Verify in database
    const faqs = await db.select()
      .from(faqsTable)
      .where(eq(faqsTable.id, result.id))
      .execute();

    expect(faqs[0].display_order).toEqual(0);
  });
});
