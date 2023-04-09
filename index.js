// Set Const
const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";

const userData = [];
const userPanel = document.querySelector("#user-panel");

// Construct the User Card
function displayUser(userData) {
  let HTMLContent = "";
  userData.forEach((user) => {
    HTMLContent += `
          <div class="card" style="max-width: 200px;">
            <img src="${user.avatar}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${user.name} ${user.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-user" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#user-modal">More</button>
              <button class="btn btn-info btn-add-friend" data-id="${user.id}">Add</button>
            </div>
          </div>
          `;
  });
  userPanel.innerHTML = HTMLContent;
}

// Get the whole data from the API and show the user card
function getAllUsers() {
  axios
    .get(INDEX_URL)
    .then((response) => {
      userData.push(...response.data.results);
      displayUser(userData);
    })
    .catch((error) => console.log(error));
}

// Display the Modal for the details of the specific user
function showMoreUserInfo(event) {
  const id = event.target.dataset.id;
  if (!id) {
    return;
  }

  const modalUser = document.querySelector("#modal-user-name");
  const modalImage = document.querySelector("#modal-user-image");
  const modalEmail = document.querySelector("#modal-user-email");
  const modalGender = document.querySelector("#modal-user-gender");
  const modalAge = document.querySelector("#modal-user-age");
  const modalRegion = document.querySelector("#modal-user-region");
  const modalBirthday = document.querySelector("#modal-user-birthday");

  modalUser.innerHTML = "";
  modalImage.src = "";
  modalEmail.innerHTML = "";
  modalGender.innerHTML = "";
  modalAge.innerHTML = "";
  modalRegion.innerHTML = "";
  modalBirthday.innerHTML = "";

  axios
    .get(INDEX_URL + "/" + id)
    .then((response) => {
      const user = response.data;
      modalUser.textContent = user.name + " " + user.surname;
      modalImage.src = user.avatar;
      modalEmail.textContent = `E-mail: ${user.email}`;
      modalGender.textContent = `Gender: ${user.gender}`;
      modalAge.textContent = `Age: ${user.age}`;
      modalRegion.textContent = `Region: ${user.region}`;
      modalBirthday.textContent = `Birthday: ${user.birthday}`;
    })
    .catch((error) => console.log(error));
}

// Check the bottom clicked and show the user modal
userPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-user")) {
    showMoreUserInfo(event);
  } else if (event.target.matches('.btn-add-friend')) {
    addFriend(Number(event.target.dataset.id))
  }
});

//Execute showing the card to the HTML
getAllUsers();

//Check the input contents of the search bar
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

searchForm.addEventListener('submit', function searchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUser = []

  filteredUser = userData.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )

  if (filteredUser.length === 0) {
    return alert(`您輸入的關鍵字 ${keyword} 沒有符合條件的使用者。`)
  }

  displayUser(filteredUser)
})

function addFriend(id) {
  const friendList = JSON.parse(localStorage.getItem('friends')) || []
  const friend = userData.find((user) => user.id === id)
  if (friendList.some((user) => user.id === id)) {
    return alert(`這位使用者已經是您的好友！`)
  }
  friendList.push(friend)
  localStorage.setItem('friends', JSON.stringify(friendList))
}