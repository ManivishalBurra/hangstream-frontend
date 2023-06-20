const customEvent = new Event('myEvent');

// Create a function that triggers the custom event
function triggerCustomEvent() {
  // Dispatch the custom event on a specific element or target
  document.dispatchEvent(customEvent);
}

// Attach an event listener to the custom event
document.addEventListener('myEvent', function(event) {
  console.log('Custom event triggered!');
});

// Trigger the custom event
triggerCustomEvent();