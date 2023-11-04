import {
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import { database } from "../src/firebaseConfig";

export const updateDB = async (userId, payload) => {
  try {
    const Ref = doc(database, "admins", userId);
    await updateDoc(Ref, payload);
    return true;
  } catch (error) {
    alert(`Error updating document: ${error.message}`);
    return false;
  }
};

export const deleteDB = async (userId) => {
  try {
    const Ref = doc(database, "admins", userId);
    await deleteDoc(Ref);
    return true;
  } catch (error) {
    alert(`Error deleting document: ${error.message}`);
    return false;
  }
};

export const addDB = async (formData) => {
  try {
    const q = query(
      collection(database, "admins"),
      where("email", "==", `${formData.email}`)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Email Already Exists!!");
    } else {
      const UserData = {
        name: formData.name,
        email: formData.email,
        superadmin: formData.superadmin ? true : false,
        active: true,
        permissions: {
          create: false,
          edit: false,
          view: true,
        },
      };

      const docRef = await addDoc(collection(database, "admins"), UserData);
      console.log("Document written with ID: ", docRef.id);

      return true;
    }
  } catch (error) {
    alert(`Error adding admin: ${error.message}`);
    return false;
  }
};
