document.getElementById("profile-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const experience = document.getElementById("experience").value;

    // Send form data to the server
    fetch('/save-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, experience }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Profile saved:', data);
        alert('Profile saved successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
