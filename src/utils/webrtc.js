export const CreateLocalStream = async (localStreamref, userID)=>{
    let constraints = {
        'video': false,
        'audio': true
      }
      await navigator.mediaDevices.enumerateDevices()
        .then(event => {
            console.log(event, "all devices")
          event.map((item)=>{
            switch(item.kind){
              case 'audiooutput':
                constraints.audio = true;
                break;
              case 'videoinput':
                constraints.video = true;
                break;
            }
          })
          navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
              //setting the localstream.
              localStreamref.current.srcObject = stream;
          })
          .catch(error => {
              console.error('Error accessing media devices.', error);
          }); 
        })
        .catch(error => {
            console.error(error)
          }
        )
}


const getOffer = () => {

}