const functions = require('firebase-functions')
const admin = require('firebase-admin') // Needed to perform some database operation
admin.initializeApp()

// Auth trigger(new user signup)
exports.newUserSignUp = functions.auth.user().onCreate( user => {
    // console.log('user created', user.email, user.uid)
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upvotedOn: []
    })
})

// Auth trigger(user deleted)
exports.userDeleted = functions.auth.user().onDelete( user => {
    // console.log('user deleted', user.email, user.uid)
    const doc =  admin.firestore().collection('users').doc(user.uid)
    return doc.delete()
})

// http callable function( for adding a request )
exports.addOption = functions.https.onCall( (data, context) => {
    // To check, if the user is authenticated,who has made the request
    if(!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', // Error code
            'only authenticated user can add a new option, please register/login.' // Error message
        )
    }
    if(data.text.length > 30) {
        throw new functions.https.HttpsError(
            'aborted',
            'a option must not be more than 30 characters long'
        )
    }
    return admin.firestore().collection('options').add({
        text: data.text,
        upvotes: 0
    }).then(() => {
        return {
            message: `Success ${data.text} has been added to poll option..`
        }
    }).catch( err => {
        return err
    })

})

// upvote callable function
exports.upvote = functions.https.onCall( (data, context) => {

    // Check if the user is authenticated
    if(!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', // Error code
            'only authenticated user can upvote, please register/login.'
        )
    }

    // Get refs for user doc and option doc
    const user = admin.firestore().collection('users').doc(context.auth.uid)
    const option = admin.firestore().collection('options').doc(data.id)


    return user.get().then(doc => {

        // Check if the user has already upvoted the option
        if(doc.data().upvotedOn.includes(data.id)){
            throw new functions.https.HttpsError(
                'already-exists',
                'you can only upvote something once'
            )
        }

        // update user's upvotedOn array
        return user.update({
            upvotedOn: [...doc.data().upvotedOn, data.id]
        })
        .then(() => {
            //Update votes on the option
            return option.update({
                upvotes: admin.firestore.FieldValue.increment(1)
            }).then( () => {
                return {
                    message: 'Successfully Updated!'
                }
            })
        })

    })
})

// Firestore trigger for tracking activity
exports.logActivities = functions.firestore.document('/{collection}/{id}')
    .onCreate( (snap, context) => { 
        
        console.log(snap.data())

        const collection = context.params.collection
        const id = context.params.id

        const activities = admin.firestore().collection('activities')

        if(collection === 'options') {
            return activities.add({ text: 'a new poll option was added' }).then( () => {
                return {
                    message : 'sucessfully done!'
                }
            })
        }
        if(collection === 'users') {
            return activities.add({ text: 'a new user signed up' }).then( () => {
                return {
                    message : 'successfully done!'
                }
            })
        }
        return null
    })












// Cloud Functions Test

// // http request 1
// exports.randomNumber = functions.https.onRequest((request, response) => {
//     const number = Math.round(Math.random() * 100)
//     // response.send(number.toString())
//     response.json({message: "Hello!"})
// })

// // http request 27
// exports.toTheDojo = functions.https.onRequest((request, response) => {
//     response.redirect('https:www.thenetninja.co.uk')
// })


// http callable function
// exports.sayHello = functions.https.onCall((data, context) => {
//     return `Hello, Ninja ${data.name}`
// })