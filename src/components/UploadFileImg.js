import React, { Component } from 'react';
import './UploadFileImg.css';
import firebase from "firebase";

class UploadFileImg extends Component {
    constructor(props) {
        super(props);
        this.handleFiles = this.handleFiles.bind(this);
        this.handleFileup = this.handleFileup.bind(this);
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
                console.log(snapshot);
                snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                });
            });
        });

    }
}
class UploadFileImgTemplate extends UploadFileImg {
    render() {
        return (
            <div className="upload">
                <p>
                    <span>uploadFile</span>
                    <input type="file" ref={this.fileInput} onChange={this.handleFiles} placeholder="file 1"/>
                    <input type="submit"  onClick={this.handleFileup} /><br/>
                    {/*<span>{fileStatus}</span>*/}
                </p>
                <p>
                    <span>uploadFileBlob</span>
                    <input type="file" ref="fileBlob" onChange="handleFilesBlob" placeholder="file blob"/>
                    <input type="submit"  onClick="uploadFileBlob"/><br/>
                    {/*<span>{fileBlobStatus}</span>*/}
                </p>
                <p>
                    <span>uploadFileEtat</span>
                    <input type="file" ref="fileEtat" multiple onChange="handleFileEtat" placeholder="upload File Etat"/>
                    <input type="submit"  onClick="uploadFileEtat"/><br/>
                    {/*<span>{fileEtatStatus}</span>*/}
                </p>
            <canvas ref={this.canvas} ></canvas>
            </div>
        );
    }
}

export default UploadFileImgTemplate;