import React from 'react';
import {
  PDFDownloadLink,
  Page,
  Text,
  Link,
  Image,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import logo from '../../public/OD_Logo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    // flexGrow: 1,
    borderStyle: "solid",
    borderColor: "#205489",
    borderRadius: "3px",
    borderWidth: '1px'
  },
  logo: {
    width: '75px',
    height: '75px',
  },
  title: {
    color: '#205489',
    // fontWeight: 'bold',
    // fontSize: 'large',
  },
  date: {
    color: '#8e8e8e',
  },
  link: {
    color: '#434343',
  },
  content: {
    color: '#000000',
  },
  author: {
    color: '#c6c6c6'
  },
});

const ODPDF = (props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src={logo} style={styles.logo}></Image>
      <Text>DEFENSEWERX</Text>
      {props.response.map((res, i) => {
        let source = '';
        switch (res.result_metadata.collection_id) {
          case '6a68c899-78de-1f84-0000-018898843003':
            source = 'USPTO';
            break;
          case 'b2072fda-e81c-a94b-0000-01887dd6f2da':
            source = 'Arxiv';
            break;
          case 'b2072fda-e81c-a94b-0000-01887d931593':
            source = 'DHS';
            break;
          case 'f9de9f28-d5aa-ac14-0000-0189ad90ddd1':
            source = 'TechCrunch';
            break;
          default:
            source = '';
        }

        return (
          <View style={styles.section}>
            <Text style={styles.title}>{res.title} </Text>
            <Text style={styles.date}>
              {source}, {res.date.substring(0, res.date.indexOf('T'))},{' '}
            </Text>
            <Link style={styles.link} src={res.pdf_url || res.url}>{res.pdf_url || res.url}</Link>
            <Text style={styles.content}>{res.abstract || res.abstract_text}</Text>
            {res.author ? <Text style={styles.author}>Author(s): {res.author}</Text> : <Text></Text>}
          </View>
        );
      })}
    </Page>
  </Document>
);

function ExportPDF(props) {
  return (
    <div className="exportbutton">
      <PDFDownloadLink
        document={<ODPDF response={props.response} search={props.search} />}
        fileName={'OD_' + Date.now() + '.pdf'}
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Generating PDF...' : 'Export to PDF'
        }
      </PDFDownloadLink>
    </div>
  );
}

export default ExportPDF;
