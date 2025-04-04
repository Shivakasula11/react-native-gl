// src/screens/PrivacyPolicyScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to GodLync! This Privacy Policy explains how we collect, use, disclose, and protect your information. By using our app, you agree to the collection and use of information in accordance with this policy.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.text}>
        We collect information to provide and improve our services. The types of information we may collect include:
      </Text>
      <Text style={styles.bulletPoint}>• Personal Information: Information such as your name, email address, and phone number.</Text>
      <Text style={styles.bulletPoint}>• Usage Data: Information about how you use the app, including interactions, preferences, and other data.</Text>
      <Text style={styles.bulletPoint}>• Device Information: Information about the device you use, including IP address, browser type, and other diagnostic data.</Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use the collected information for various purposes, such as:
      </Text>
      <Text style={styles.bulletPoint}>• Providing and maintaining our services.</Text>
      <Text style={styles.bulletPoint}>• Improving and personalizing your experience.</Text>
      <Text style={styles.bulletPoint}>• Communicating with you about updates, offers, and important notices.</Text>
      <Text style={styles.bulletPoint}>• Ensuring security and preventing fraud.</Text>

      <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
      <Text style={styles.text}>
        We may share your information with third parties in certain situations, including:
      </Text>
      <Text style={styles.bulletPoint}>• With your consent, for example, when you agree to share your information with third-party partners.</Text>
      <Text style={styles.bulletPoint}>• To comply with legal obligations, such as responding to a subpoena or court order.</Text>
      <Text style={styles.bulletPoint}>• With service providers who perform functions on our behalf, such as data storage or analytics.</Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.text}>
        We take data security seriously and use reasonable measures to protect your information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Rights</Text>
      <Text style={styles.text}>
        Depending on your location, you may have rights regarding your personal information, including:
      </Text>
      <Text style={styles.bulletPoint}>• Access: The right to request access to the information we hold about you.</Text>
      <Text style={styles.bulletPoint}>• Rectification: The right to request correction of inaccurate information.</Text>
      <Text style={styles.bulletPoint}>• Deletion: The right to request deletion of your information, subject to certain conditions.</Text>

      <Text style={styles.sectionTitle}>7. Changes to This Privacy Policy</Text>
      <Text style={styles.text}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions or concerns about this Privacy Policy, please contact us at:
      </Text>
      <Text style={styles.contactInfo}>Email: support@godlync.com</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color: '#4CAF50',
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginVertical: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#555',
    marginLeft: 16,
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
});

export default PrivacyPolicyScreen;