export const parseAiJson = (responseText) => {
  let cleanJson = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleanJson);
  } catch (firstError) {
    console.error('Parse failed:', firstError.message);
    console.error('Response length:', cleanJson.length);
    console.error('Last 100 chars:', cleanJson.slice(-100));

    const repaired = cleanJson.replace(/[\r\n\t]+/g, ' ');

    try {
      return JSON.parse(repaired);
    } catch (secondError) {
      console.error('Repaired parse also failed:', secondError.message);
      throw secondError;
    }
  }
};
