
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { getContactInfo } from '../handlers/get_contact_info';

describe('getContactInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no contact info exists', async () => {
    const result = await getContactInfo();
    expect(result).toBeNull();
  });

  it('should return contact info when it exists', async () => {
    // Create test contact info
    const testContactInfo = {
      business_name: 'Test Catering Business',
      address: '123 Test Street, Test City',
      phone_number: '+60123456789',
      whatsapp_number: '+60123456789',
      email: 'test@example.com',
      operating_hours: 'Mon-Fri 9AM-6PM',
      social_media_links: JSON.stringify({
        facebook: 'https://facebook.com/test',
        instagram: 'https://instagram.com/test'
      })
    };

    await db.insert(contactInfoTable)
      .values(testContactInfo)
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.business_name).toEqual('Test Catering Business');
    expect(result!.address).toEqual('123 Test Street, Test City');
    expect(result!.phone_number).toEqual('+60123456789');
    expect(result!.whatsapp_number).toEqual('+60123456789');
    expect(result!.email).toEqual('test@example.com');
    expect(result!.operating_hours).toEqual('Mon-Fri 9AM-6PM');
    expect(result!.social_media_links).toEqual(JSON.stringify({
      facebook: 'https://facebook.com/test',
      instagram: 'https://instagram.com/test'
    }));
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return only the first contact info when multiple exist', async () => {
    // Create multiple contact info records
    const contactInfo1 = {
      business_name: 'First Business',
      address: '123 First Street',
      phone_number: '+60111111111',
      whatsapp_number: '+60111111111',
      email: 'first@example.com',
      operating_hours: 'Mon-Fri 8AM-5PM',
      social_media_links: null
    };

    const contactInfo2 = {
      business_name: 'Second Business',
      address: '456 Second Street',
      phone_number: '+60222222222',
      whatsapp_number: '+60222222222',
      email: 'second@example.com',
      operating_hours: 'Mon-Sun 9AM-9PM',
      social_media_links: null
    };

    await db.insert(contactInfoTable)
      .values([contactInfo1, contactInfo2])
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.business_name).toEqual('First Business');
    expect(result!.phone_number).toEqual('+60111111111');
  });

  it('should handle null email field correctly', async () => {
    const testContactInfo = {
      business_name: 'Test Business',
      address: '123 Test Street',
      phone_number: '+60123456789',
      whatsapp_number: '+60123456789',
      email: null,
      operating_hours: 'Mon-Fri 9AM-6PM',
      social_media_links: null
    };

    await db.insert(contactInfoTable)
      .values(testContactInfo)
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.email).toBeNull();
    expect(result!.social_media_links).toBeNull();
    expect(result!.business_name).toEqual('Test Business');
  });
});
