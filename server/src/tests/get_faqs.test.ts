
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { faqsTable } from '../db/schema';
import { getFAQs } from '../handlers/get_faqs';

describe('getFAQs', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no FAQs exist', async () => {
    const result = await getFAQs();
    expect(result).toEqual([]);
  });

  it('should return active FAQs ordered by display_order', async () => {
    // Create test FAQs with different display orders
    await db.insert(faqsTable).values([
      {
        question: 'Question 3',
        answer: 'Answer 3',
        category: 'general',
        display_order: 3,
        is_active: true
      },
      {
        question: 'Question 1',
        answer: 'Answer 1',
        category: 'general',
        display_order: 1,
        is_active: true
      },
      {
        question: 'Question 2',
        answer: 'Answer 2',
        category: 'pricing',
        display_order: 2,
        is_active: true
      }
    ]).execute();

    const result = await getFAQs();

    expect(result).toHaveLength(3);
    expect(result[0].question).toBe('Question 1');
    expect(result[1].question).toBe('Question 2');
    expect(result[2].question).toBe('Question 3');

    // Verify all results have required fields
    result.forEach(faq => {
      expect(faq.id).toBeDefined();
      expect(faq.question).toBeDefined();
      expect(faq.answer).toBeDefined();
      expect(faq.display_order).toBeDefined();
      expect(faq.is_active).toBe(true);
      expect(faq.created_at).toBeInstanceOf(Date);
      expect(faq.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should exclude inactive FAQs', async () => {
    // Create both active and inactive FAQs
    await db.insert(faqsTable).values([
      {
        question: 'Active FAQ',
        answer: 'Active answer',
        category: 'general',
        display_order: 1,
        is_active: true
      },
      {
        question: 'Inactive FAQ',
        answer: 'Inactive answer',
        category: 'general',
        display_order: 2,
        is_active: false
      }
    ]).execute();

    const result = await getFAQs();

    expect(result).toHaveLength(1);
    expect(result[0].question).toBe('Active FAQ');
    expect(result[0].is_active).toBe(true);
  });

  it('should handle FAQs with null categories', async () => {
    await db.insert(faqsTable).values({
      question: 'FAQ without category',
      answer: 'Answer without category',
      category: null,
      display_order: 1,
      is_active: true
    }).execute();

    const result = await getFAQs();

    expect(result).toHaveLength(1);
    expect(result[0].question).toBe('FAQ without category');
    expect(result[0].category).toBeNull();
  });
});
