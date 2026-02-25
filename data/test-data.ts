export const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'password',
};

export const invalidCredentials = {
  username: 'wronguser',
  password: 'wrongpass',
};

export const testRoom = {
  name: '501',
  type: 'Suite',
  accessible: true,
  price: '250',
  features: ['WiFi', 'TV', 'Safe', 'Views'] as string[],
};

export const contactFormValid = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '01234567890',
  subject: 'Booking Inquiry for Summer',
  description: 'Hello, I would like to inquire about room availability for the first two weeks of July. We are a family of four and would prefer a suite with a view. Please let me know the rates.',
};

export const contactFormInvalid = {
  name: 'J',
  email: 'not-an-email',
  phone: '123',
  subject: 'Hi',
  description: 'Too short.',
};

export const contactFormExpectedErrors = {
  blank: [
    'Name may not be blank',
    'Email may not be blank',
    'Phone may not be blank',
    'Subject may not be blank',
    'Message may not be blank',
  ],
  invalid: [
    'Phone must be between 11 and 21 characters',
    'Subject must be between 5 and 100 characters',
    'Message must be between 20 and 2000 characters',
  ],
};
