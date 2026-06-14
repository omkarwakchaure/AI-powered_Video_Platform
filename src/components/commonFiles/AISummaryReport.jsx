import { Page, Text, View, Document } from '@react-pdf/renderer';
import React from 'react';

const AISummaryReport = ({ data, language }) => {
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>{data.videoInfo.title}</Text>
          <Text>{data.videoInfo.channelName}</Text>

          <Text>AI Summary</Text>
          <Text>{data.summary?.[language]}</Text>

          <Text>Key Points</Text>
          {data.keyPoints?.[language]?.map((point, index) => (
            <Text key={index}>• {point}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default AISummaryReport;
