import React, { Component } from 'react';
import marked from 'marked'
import ReactHtmlParser from 'react-html-parser';
import firebase from 'firebase'
import Button from '@material-ui/core/Button';


import './App.css';



class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            tab: [],
            tabtest: [
                {user:"te1", msg:'lol'},
                {user:"te2", msg:'lol'},
                {user:"te3", msg:'lol'},
            ],
            userCo: false,
            user: null,
            message: null,
            messageMd: null,
            imgMd: null,
            newMsg:false,
            msg: 'lol'
        };
        this.handleChangeMsg = this.handleChangeMsg.bind(this);
        this.handleChangeMsgMd =this.handleChangeMsgMd.bind(this);
        this.handleFiles =this.handleFiles.bind(this);
        this.handleFileup =this.handleFileup.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.handleFileup = this.handleFileup.bind(this);
        this.addTab =this.addTab.bind(this);
        this.dbchat = firebase.database().ref('/chat');
        this.fileInput = React.createRef();
        this.canvas = React.createRef();
        this.storageUpload = firebase.storage().ref('/image');

    }

    handleFiles(event) {
        event.preventDefault();
        let file = this.fileInput.current.files[0];
        let fr = new FileReader();
        let img = new Image();
        fr.onload = (e) => {
            img.onload = (e) => {
                let canvas = this.canvas.current;
                canvas.width = 200;      // set canvas size big enough for the image
                canvas.height = 300;
                // canvas.width = img.width;      // set canvas size big enough for the image
                // canvas.height = img.height;
                canvas.style.width = 200+"px";      // set canvas size big enough for the image
                canvas.style.height = 300+"px";
                console.log(img.width);
                console.log(img.height);
                let ctx = canvas.getContext("2d");
                console.log(canvas.height);
                console.log(canvas.width);
                // ctx.drawImage(img,0,0, img.width, img.height,0,0,100,170);         // draw the image
                ctx.drawImage(img,0,0,200,300);
                ctx.beginPath();
                ctx.moveTo(30, 96);
                ctx.lineTo(70, 66);
                ctx.lineTo(103, 76);
                ctx.lineTo(170, 15);
                ctx.stroke();// draw the image

// do some manipulations...

                // console.log(canvas.toDataURL("image/png"));

            };
            img.src = fr.result;
        };   // onload fires after reading is complete
        fr.readAsDataURL(file);
    }
    handleFileup(event) {
        let canvas = this.canvas.current;
        let file = this.fileInput.current.files[0];

        canvas.toBlob((blob) => {
            this.storageUpload.child('/'+file.name).put(blob).then((snapshot) => {
                // this.fileBlobStatus = "Uploaded succes";
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.setState({
                        imgMd:"![alt image]("+downloadURL+")",
                        messageMd:"![alt image]("+downloadURL+")"
                    })
                });
            });
        });

    }

    componentDidMount() {
        this.getTab();
        this.getUser();
        this.scrollMsgEnd();
    }
    componentDidUpdate() {
        if (this.state.newMsg){
            this.scrollMsgEnd();
            this.setState({newMsg : false});
        }
    }

                             handleChangeMsg (event) {
        this.setState({message: event.target.value});
        // console.log(event.target.value);
    }

    // handleChangeMsg = (event) => {
    //     this.setState({message: event.target.value});
    //     console.log(event.target.value);
    // }


    handleChangeMsgMd (event) {
        this.setState({messageMd: event.target.value});
    }


    uniqueID () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    scrollMsgEnd(){
        if(document.querySelector('.Chat ul > li:last-child') !== null){

            // document.querySelector('.Chat ul > li:last-child').scrollIntoView({block: "end", inline: "end"});
            document.querySelector('.Chat ul').scrollBy({
                top: document.querySelector('.Chat ul').scrollHeight,
                // left: 100,
                behavior: 'smooth'
            });
        }
        // console.log(document.querySelector('.Chat ul').scrollWidth);
        // console.log(document.querySelector('.Chat ul').scrollHeight);
        // console.log(document.querySelector('.Chat ul').scrollTop);
    }

    compiledMarkdown (val) {
        if (val) {
            // console.log(marked(val, {sanitize: true}));
            return marked(val, { sanitize: true })
        }
    }
    isClassUser(user) {
        if (this.state.user == user) {

            return "me"

        } else {
            return "nome"

        }
    }
    addTab (event) {
        this.dbchat.push({
            id: this.uniqueID(),
            msg: this.state.message,
            msgMd: this.state.messageMd,
            user: this.state.user

        });

        this.setState({
            message: '',
            messageMd: ''
        });
    }
    getTab () {

        this.dbchat.on('value', (snapshot) => {
            this.setState({
                tab: snapshot.val(),
                newMsg : true
            });
        })
    }
    getUser () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    userCo : true,
                    user : user.displayName
                })
            } else {
                this.setState({userCo : false});
                this.loginGoogle();
            }
        });
    }
    loginGoogle () {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // The signed-in user info.
            this.setState({ user : result.user.displayName });
            console.log(this.user);
            // this.userCo = true;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    }
}
class AppTemplate extends App {

    listItems;
    shouldComponentUpdate(nextProps, nextState) {
        // console.log(Object.values(this.state.tab));
        // console.log(nextState);
        // console.log(nextState.tab);
        this.listItems = Object.values(nextState.tab).map((tab) =>
            <li className={this.isClassUser(tab.user)}>
                { tab.user }:{ tab.msg } : {ReactHtmlParser(this.compiledMarkdown(tab.msgMd))}
            </li>

        );
        return true
    }

    render = () => (
        <div className="Chat">
            <div>Connecter:{ (() => {if (this.state.userCo){ return 'connecter'}else{ return 'noconnecter'}})()}</div>
            <div>Connecter:{(this.state.userCo)? 'connecter' : 'noconnecter'}</div>
            <div>user:{this.state.user}</div>
            <ul>
                {this.listItems}
            </ul>
            <input type="text" value={this.state.message}  placeholder="modifiez-moi" onChange={this.handleChangeMsg} />
            <textarea value={this.state.messageMd} onChange={this.handleChangeMsgMd} ></textarea>
            <p>
                <span>uploadFile</span>
                <input type="file" ref={this.fileInput} onChange={this.handleFiles} placeholder="file 1"/>
                <input type="submit"  onClick={this.handleFileup} /><br/>
                {/*<span>{fileStatus}</span>*/}
            </p>
            {/*<button onClick={this.addTab}>add</button>*/}
            <Button  onClick={this.addTab} variant="contained" color="primary">
               add
            </Button>
            <canvas ref={this.canvas} ></canvas>


        </div>
    )

}

export default AppTemplate;
