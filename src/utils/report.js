import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

export const generateReport = async ({ document, fileName }) => {
  const blob = await pdf(document).toBlob();

  saveAs(blob, fileName);
};
