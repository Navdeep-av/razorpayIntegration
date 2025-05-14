export const mailOptions = ({ to, subject, text }) => {
  return {
    from: '"Navdeep Gupta" <forotherwork96@gmail.com>',
    to,
    subject,
    text,
  };
};
