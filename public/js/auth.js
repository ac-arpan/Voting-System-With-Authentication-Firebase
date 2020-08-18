const authSwitchLinks = document.querySelectorAll('.switch')
const authModals = document.querySelectorAll('.auth .modal')
const authWrapper = document.querySelector('.auth')
const registerForm = document.querySelector('.register')
const loginForm = document.querySelector('.login')
const signOut = document.querySelector('.sign-out')

// toggle auth modals
authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'))
  })
})

// register the user
registerForm.addEventListener('submit', e => {
    e.preventDefault()

    const email = registerForm.email.value
    const password = registerForm.password.value

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( userCred => {
            // console.log(userCred.user)
            registerForm.reset()
        })
        .catch( err => {
            registerForm.querySelector('.error').innerHTML = err.message
        })

})

// sign in the user
loginForm.addEventListener('submit', e => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then( userCred => {
            // console.log(userCred.user)
            loginForm.reset()
        })
        .catch( err => {
            loginForm.querySelector('.error').innerHTML = err.message
        })

})

// Signout the user
signOut.addEventListener('click', () => {
    firebase.auth().signOut().then( () => console.log('user signed out'))
})

// Auth Listener
firebase.auth().onAuthStateChanged( user => {
    if(user) {  
        authWrapper.classList.remove('open')
        authModals.forEach(modal => modal.classList.remove('active'))
    } else {
        authWrapper.classList.add('open')
        authModals[0].classList.add('active')
    }
})
