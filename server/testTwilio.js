const twilio = require('twilio');
try {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({ language: 'en-IN', voice: 'Polly.Aditi' }, `Hello. This is to inform you.`);
  console.log("Success:", twiml.toString());
} catch (e) {
  console.error("Error:", e);
}
