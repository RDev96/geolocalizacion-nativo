import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, updateDoc, getDocs, query, where, collection  } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";


window.addEventListener('load', function(){
    console.log("Hola Mundo");
})

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDuoUpjYY2vsADp-W-MIk16CUj8K14U-R4",
    authDomain: "flutter-ayuda-0vretm.firebaseapp.com",
    projectId: "flutter-ayuda-0vretm",
    storageBucket: "flutter-ayuda-0vretm.appspot.com",
    messagingSenderId: "648421902707",
    appId: "1:648421902707:web:f773a368162ac455795d06"
};

const status = document.querySelector('.status')


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();


// Función para iniciar sesión (ejemplo)
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = "raulcampos@gmail.com";
    const password = "password";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Ingreso exitoso
            const user = userCredential.user;
            console.log("Usuario conectado:", user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error de inicio de sesión:", errorCode, errorMessage);
        });
});


// Función para editar usuario por UID
function editarUsuario(uid, newEmail) {
    const userRef = doc(firestore, 'users', uid);
    updateDoc(userRef, {
        email: newEmail,
        updatedAt: serverTimestamp()
    })
    .then(() => {
        console.log("Usuario actualizado:", uid);
    })
    .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
    });
}

// Función para registrar un nuevo usuario
function registrarUsuario(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario registrado:", user);

            return setDoc(doc(firestore, 'users', user.uid), {
                email: email,
                createdAt: serverTimestamp()
            });
        })
        .then(() => {
            console.log("Registro añadido a Firestore");
        })
        .catch((error) => {
            console.error("Error de registro:", error.code, error.message);
        });
}

// Función para buscar y editar usuario por email
async function editarUsuarioPorEmail(email, latitud, longitud) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No se encontró ningún usuario con ese email.");
        return;
    }

    querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
            latitud: latitud,
            longitud: longitud,
            updatedAt: serverTimestamp()
        });
        console.log("Usuario actualizado por email:", doc.id);
    });
}


const findMyStatus = () => {
    
    

    
    
    navigator.geolocation.getCurrentPosition(successPosicion, errorPosicion)


}


function successPosicion(position) {
    console.log(position)

    const lat = position.coords.latitude
    const long = position.coords.longitude
    editarUsuarioPorEmail("raulcampos@gmail.com", lat, long)
     status.textContent =  "latitud: "+ lat + ' longitud: ' + long
}

function errorPosicion(err) {
    switch(err.code) {
        case err.PERMISSION_DENIED:
            alert("Debe usted permitir el acceso a su posición para que la aplicación pueda funcionar");
            break;
        case err.POSITION_UNAVAILABLE:
            alert("La información sobre su posición actual no está disponible");
            break;
        case err.TIMEOUT:
            alert("No he podido obtener su posición en un tiempo razonable");
            break;
        default:
            alert("Se ha producido un error desconocido al intentar obtener la posición actual");
            break;
    }
}

//document.querySelector('.find-state').addEventListener('click', findMyStatus)

// Ejecutar la función cada 10 segundos (10000 milisegundos)
setInterval(findMyStatus, 10000);