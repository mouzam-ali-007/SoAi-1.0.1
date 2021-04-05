export function helloWorld() {
  console.log("hello World", getCurrentTime());
}

export function shrinkExpiry() {
  var expires = JSON.parse(sessionStorage.getItem("userAuthData")).expires;
  let time = expires.split(" ")[4].split(":");

  let min = parseInt(time[1]);
  let hour = parseInt(time[0]);
  if (hour > 12) {
    hour = hour - 12;
  }

  if (min === 0) {
    min = 58;
  } else if (min === 1) {
    min = 59;
  } else {
    min = min - 2;
  }
  let newExpiry = hour + ":" + min;

  console.log("Expiry from the shrinkExpiry", newExpiry);
  return newExpiry;
}

export function getCurrentTime() {
  const time = new Date();
  let hour, min;
  hour = parseInt(time.getHours());
  min = parseInt(time.getMinutes());

  if (hour > 12) {
    hour = hour - 12;
  } else if (hour === 0) {
    hour = 12;
  }

  return hour + ":" + min;
}

export function logOut() {
  sessionStorage.removeItem("userSessionData");
  sessionStorage.removeItem("userAuthData");
  clearInterval(localStorage.getItem("interval"));
  localStorage.removeItem("interval");
  localStorage.removeItem("notebook");
  return true;
}

export function onDisconnection() {
  logOut();
  window.location.reload();
}

export async function reNewToken({ session }) {
  const url = "https://cloud.so.ai:8443/API/token";
  const raw = `grant_type=refresh_token&refresh_token=${session.refreshToken}&client_id=SO.Ai UI`;

  await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      DNT: "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "Post",
    body: raw,
  })
    .then((res) => res.json())
    .then((jsonResponse) => {
      var tenants = JSON.parse(jsonResponse.tenants);

      var promise = new Promise((resolve, reject) => {
        tenants.forEach((value, index) => {
          if (value.roles.length) {
            localStorage.setItem("TenantId", value.id);
            resolve({ status: true, index });
          }
        });
      });

      promise.then((val) => {
        sessionStorage.setItem(
          "userAuthData",
          JSON.stringify({
            userId: jsonResponse.id,
            token: jsonResponse.access_token,
            expires: jsonResponse[".expires"],
            refreshToken: jsonResponse.refresh_token,
            tenantId: tenants[val.index].id,
            roles: tenants[val.index].roles,
          })
        );
      });
      // also set the new time and new token to the  session

      session.refreshToken = jsonResponse.refresh_token;
      console.log("Token Refreshed at ", getCurrentTime());
      console.log("Next expiry time", jsonResponse[".expires"]);
    })
    .catch((e) => {
      console.log(e);
    });
}
