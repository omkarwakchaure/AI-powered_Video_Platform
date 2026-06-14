import { Document, Page, Text, View, StyleSheet, Svg, Path, Font } from '@react-pdf/renderer';
import React from 'react';

Font.register({
  family: 'NotoSansDevanagari',
  fonts: [
    { src: '/fonts/NotoSansDevanagari-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/NotoSansDevanagari-Bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 24,
    fontSize: 11,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 18,
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
  },
  bullet: {
    marginBottom: 6,
  },
  heading: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    color: '#666',
  },
});

// Heroicons outline paths (24x24 viewBox), recreated for react-pdf's Svg/Path
const DocumentTextIcon = ({ color = '#6366f1', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LightBulbIcon = ({ color = '#eab308', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BookOpenIcon = ({ color = '#22c55e', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AISummaryReport = ({ data, language }) => {
  const isDevanagari = language === 'hindi' || language === 'marathi';

  const pageStyle = isDevanagari ? { ...styles.page, fontFamily: 'NotoSansDevanagari' } : styles.page;

  return (
    <Document>
      <Page size="A4" style={pageStyle} wrap>
        {/* Summary */}
        <View style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <DocumentTextIcon />
            <Text style={styles.sectionTitle}>AI Summary</Text>
          </View>
          <Text style={styles.text}>{data.summary?.[language]}</Text>
        </View>

        {/* Key Points */}
        <View style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <LightBulbIcon />
            <Text style={styles.sectionTitle}>Key Points</Text>
          </View>
          {data.keyPoints?.[language]?.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Detailed Guide */}
        {data.detailedGuide?.[language]?.map((section, index) => (
          <View key={index} style={styles.section} wrap={false}>
            {index === 0 && (
              <View style={styles.sectionHeader}>
                <BookOpenIcon />
                <Text style={styles.sectionTitle}>Detailed Guide</Text>
              </View>
            )}
            <Text style={styles.heading}>{section.heading}</Text>
            {section.content.map((item, i) => (
              <Text key={i} style={styles.bullet}>
                • {item}
              </Text>
            ))}
          </View>
        ))}

        {/* Important Takeaways */}
        <View style={styles.section} wrap={false}>
          <View style={styles.sectionHeader}>
            <LightBulbIcon />
            <Text style={styles.sectionTitle}>Important Takeaways</Text>
          </View>
          {data.importantTakeaways?.[language]?.map((item, index) => (
            <Text key={index} style={styles.bullet}>
              ✓ {item}
            </Text>
          ))}
        </View>

        <Text fixed style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </Page>
    </Document>
  );
};

export default AISummaryReport;
