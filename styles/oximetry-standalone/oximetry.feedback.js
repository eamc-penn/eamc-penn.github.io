let rating = 0;
const stars = document.getElementsByClassName("star");
const success_msg = document.getElementById("success-message");
const uuid = crypto.randomUUID();

for (var i = 0; i < stars.length; i++) {
  stars[i].addEventListener("click", function() {
    rating = parseInt(this.dataset.rating);
    highlightStars();
    submitFeedback();
  });

  stars[i].addEventListener("mouseenter", function() {
    highlightStars(parseInt(this.dataset.rating));
  });
}

document.getElementById("stars").addEventListener(
  "mouseleave",
  function() {
    highlightStars(rating);
  }
);

function highlightStars() {
  for (var i = 0; i < stars.length; i++) {
    if (i + 1 <= rating)
      stars[i].classList.add("active");
    else
      stars[i].classList.remove("active");
  }
}

function submitFeedback() {
  success_msg.classList.add("show");

  const feedback_url = (
    "https://docs.google.com/forms/d/e/" +
    "1FAIpQLSfKYNQoSQsXXw7t4xvGMJx1cwEQEYRoB2ejr2E82721Niz33g/formResponse"
  );
  const form = document.createElement("form");
  form.style.display = "none";
  form.method = "POST";
  form.action = feedback_url;
  form.target = "submission-frame";

  const add = (name, value) => {
    const i = document.createElement("input");
    i.type = "hidden";
    i.name = name;
    i.value = value;
    form.appendChild(i);
  };

  add("entry.750551409", uuid);
  add("entry.463142471", rating);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  setTimeout(() => {
    success_msg.classList.remove("show");
  }, 3000);
}
