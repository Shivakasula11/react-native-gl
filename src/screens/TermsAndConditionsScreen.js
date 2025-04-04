// src/screens/TermsAndConditionsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>

      <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
      <Text style={styles.text}>
        By accessing or using our application, you agree to be bound by these Terms and Conditions.
        If you do not agree to these terms, please do not use the app.
      </Text>

      <Text style={styles.sectionHeader}>2. User Accounts</Text>
      <Text style={styles.text}>
        To access certain features of the app, you may be required to create an account and provide information about yourself.
        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
      </Text>

      <Text style={styles.sectionHeader}>3. Prohibited Activities</Text>
      <Text style={styles.text}>
        You agree not to engage in any of the following prohibited activities:
        {'\n'}• Attempting to interfere with the security or functionality of the app.
        {'\n'}• Using the app for illegal or unauthorized purposes.
        {'\n'}• Engaging in activities that infringe on the rights of others.
      </Text>

      <Text style={styles.sectionHeader}>4. Intellectual Property</Text>
      <Text style={styles.text}>
        All content and materials on the app, including text, graphics, logos, and software, are the property of the app’s creators and are protected by copyright and other intellectual property laws.
        You may not use, modify, or distribute any materials from the app without express permission.
      </Text>

      <Text style={styles.sectionHeader}>5. Limitation of Liability</Text>
      <Text style={styles.text}>
        In no event shall we be liable for any damages arising from your use of or inability to use the app, including, but not limited to, direct, indirect, incidental, or consequential damages.
      </Text>

      <Text style={styles.sectionHeader}>6. Modifications to Terms</Text>
      <Text style={styles.text}>
        We reserve the right to modify these Terms and Conditions at any time.
        Any changes will be effective immediately upon posting. It is your responsibility to review these terms periodically for updates.
      </Text>

      <Text style={styles.sectionHeader}>7. Privacy</Text>
      <Text style={styles.text}>
        Your use of the app is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
      </Text>

      <Text style={styles.sectionHeader}>8. Termination</Text>
      <Text style={styles.text}>
        We reserve the right to terminate or suspend your account and access to the app at our discretion, without notice, for conduct that we believe violates these terms.
      </Text>

      <Text style={styles.sectionHeader}>9. Contact Information</Text>
      <Text style={styles.text}>
        If you have any questions or concerns regarding these Terms and Conditions, please contact us at support@godlync.com.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#4CAF50',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});

export default TermsAndConditionsScreen;