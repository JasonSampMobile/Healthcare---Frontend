import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity
} from 'react-native';

import { database } from "../storage/Database";
import styles from './Style';
import { uuid } from 'uuidv4';
import LinearGradient from 'react-native-linear-gradient';
import { LocalizedStrings } from '../enums/LocalizedStrings';
import { EventTypes } from '../enums/EventTypes';

const OpenTextEvent = (props) => {

  const eventType = props.navigation.getParam('eventType');
  const patientId = props.navigation.getParam('patientId');
  const visitId = props.navigation.getParam('visitId');
  const [language, setLanguage] = useState(props.navigation.getParam('language', 'en'))
  const [textColor, setTextColor] = useState('#A9A9A9')
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    database.getLatestPatientEventByType(patientId, eventType).then((response: string) => {
      if (response.length > 0 && (
        eventType === EventTypes.MedicalHistory ||
        eventType === EventTypes.Allergies ||
        eventType === EventTypes.Diagnosis ||
        eventType === EventTypes.Prescriptions ||
        eventType === EventTypes.Notes)) {
        setResponseText(response)
      }
    })
  }, [props])

  const addEvent = async () => {
    database.addEvent({
      id: uuid(),
      patient_id: patientId,
      visit_id: visitId,
      event_type: eventType,
      event_metadata: responseText
    }).then(() => props.navigation.navigate('NewVisit'))
  };

  return (
    <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate('NewVisit')}>
        <Text style={styles.text}>{LocalizedStrings[language].back}</Text>
      </TouchableOpacity>
      <Text>{eventType}</Text>
      <TextInput
        style={[styles.loginInputsContainer, {color: textColor}]}
        placeholder={LocalizedStrings[language].enterTextHere}
        onChangeText={(text) => {
          setResponseText(text)
          setTextColor('#000000')
        }}
        value={responseText}
        multiline={true}
      />

      <View>
        <TouchableOpacity onPress={() => addEvent()}>
          <Image source={require('../images/login.png')} style={{ width: 75, height: 75 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default OpenTextEvent;
