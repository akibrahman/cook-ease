import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
// import propTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { app } from "./firebase.config";
// import { app } from "../../firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);

  const axiosInstance = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReloader, setAuthReloader] = useState(true);
  // Providers
  const GoogleProvider = new GoogleAuthProvider();
  //! Registration
  const registration = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  //! Login
  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  //! Google Login
  const GoogleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, GoogleProvider);
  };
  //! Update
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  //! Logout
  const logOut = () => {
    setLoading(true);
    setUser(null);
    return signOut(auth);
  };
  useEffect(() => {
    const un = onAuthStateChanged(auth, async (cUser) => {
      if (cUser) {
        //! Cteate Token
        axiosInstance
          .post(
            `/create-jwt`,
            { email: cUser.email },
            { withCredentials: true }
          )
          .then((res) => {
            if (res.data.success) {
              console.log("Token Created for - ", cUser.email);
            }
          })
          .catch((error) => {
            console.log(error);
          });
        setUser(cUser);
        const userData = {
          name: cUser.displayName,
          email: cUser.email,
          role: "general",
          badge: "bronze",
          about: "",
          likings: [],
          ulikings: [],
          photo: cUser.photoURL,
        };
        await axiosInstance.put(`/all-users/${cUser.email}`, userData);
        setLoading(false);
      } else {
        //! Remove Token
        axiosInstance
          .post(`/remove-jwt`, { email: "" }, { withCredentials: true })
          .then((data) => {
            console.log("Token Removed -", data.data);
          })
          .catch((error) => {
            console.log(error);
          });
        setUser(null);
        console.log("Logged Out");
        setLoading(false);
      }
    });
    return () => un();
  }, [authReloader, axiosInstance, auth]);
  return (
    <AuthContext.Provider
      value={{
        auth,
        authReloader,
        setAuthReloader,
        user,
        setUser,
        loading,
        setLoading,
        registration,
        logIn,
        GoogleLogin,
        updateUserProfile,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
