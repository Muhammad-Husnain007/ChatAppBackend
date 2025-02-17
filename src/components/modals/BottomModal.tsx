import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/Colors';
import { getResponsiveWidth } from '../../utils/ResponsiveNess';

const BottomModal = ({ isVisible, onClose, text1, text2, text3, deleteStatus }: any) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text1}</Text>
          <Text style={styles.modalText}>{text2}</Text>
          <Text style={styles.modalText}>{text3}</Text>

         <View style={{flexDirection: 'row', gap: getResponsiveWidth(40)}}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={deleteStatus}>
            <Text style={styles.closeButtonText}>Delete</Text>
          </TouchableOpacity>
         </View>

        </View>
      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
