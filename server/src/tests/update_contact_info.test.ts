
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput } from '../schema';
import { updateContactInfo } from '../handlers/update_contact_info';
import { eq } from 'drizzle-orm';

// Setup initial contact info data
const initialContactInfo = {
  business_name: 'Original Business',
  address: 'Original Address',
  phone_number: '1234567890',
  whatsapp_number: '0987654321',
  email: 'original@example.com',
  operating_hours: '9AM-5PM',
  social_media_links: '{"facebook": "original-fb"}'
};

const testUpdateInput: UpdateContactInfoInput = {
  business_name: 'Updated Business Name',
  address: 'Updated Address',
  phone_number: '5555555555',
  email: 'updated@example.com'
};

describe('updateContactInfo', () => {
  beforeEach(async () => {
    await createDB();
    // Insert initial contact info
    await db.insert(contactInfoTable)
      .values(initialContactInfo)
      .execute();
  });
  
  afterEach(resetDB);

  it('should update contact information', async () => {
    const result = await updateContactInfo(testUpdateInput);

    // Check updated fields
    expect(result.business_name).toEqual('Updated Business Name');
    expect(result.address).toEqual('Updated Address');
    expect(result.phone_number).toEqual('5555555555');
    expect(result.email).toEqual('updated@example.com');

    // Check unchanged fields
    expect(result.whatsapp_number).toEqual('0987654321');
    expect(result.operating_hours).toEqual('9AM-5PM');
    expect(result.social_media_links).toEqual('{"facebook": "original-fb"}');

    // Check metadata
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated contact info to database', async () => {
    const result = await updateContactInfo(testUpdateInput);

    const savedContact = await db.select()
      .from(contactInfoTable)
      .where(eq(contactInfoTable.id, result.id))
      .execute();

    expect(savedContact).toHaveLength(1);
    expect(savedContact[0].business_name).toEqual('Updated Business Name');
    expect(savedContact[0].address).toEqual('Updated Address');
    expect(savedContact[0].phone_number).toEqual('5555555555');
    expect(savedContact[0].email).toEqual('updated@example.com');
    expect(savedContact[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    const partialUpdate: UpdateContactInfoInput = {
      business_name: 'Partial Update Business'
    };

    const result = await updateContactInfo(partialUpdate);

    // Check updated field
    expect(result.business_name).toEqual('Partial Update Business');

    // Check unchanged fields remain original values
    expect(result.address).toEqual('Original Address');
    expect(result.phone_number).toEqual('1234567890');
    expect(result.whatsapp_number).toEqual('0987654321');
    expect(result.email).toEqual('original@example.com');
    expect(result.operating_hours).toEqual('9AM-5PM');
    expect(result.social_media_links).toEqual('{"facebook": "original-fb"}');
  });

  it('should handle nullable fields correctly', async () => {
    const nullableUpdate: UpdateContactInfoInput = {
      email: null,
      social_media_links: null
    };

    const result = await updateContactInfo(nullableUpdate);

    expect(result.email).toBeNull();
    expect(result.social_media_links).toBeNull();

    // Other fields should remain unchanged
    expect(result.business_name).toEqual('Original Business');
    expect(result.address).toEqual('Original Address');
  });

  it('should throw error when contact info does not exist', async () => {
    // Clear the database
    await db.delete(contactInfoTable).execute();

    await expect(updateContactInfo(testUpdateInput)).rejects.toThrow(/contact information not found/i);
  });
});
