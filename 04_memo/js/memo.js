"use strict";

window.addEventListener("DOMContentLoaded", function () {
  if (typeof localStorage === "undefined") {
    Swal.fire("エラー", "このブラウザはLocalStorageが使えません。", "error");
    return;
  } else {
    saveLocalStorage();
    viewStorage();
    selectTable();
    delLocalStorage();
    allClearLocalStorage();
  }
});

// =======================================
// 保存処理（SweetAlert2）
// =======================================
function saveLocalStorage() {
  const save = document.getElementById("save");

  save.addEventListener("click", function (e) {
    e.preventDefault();

    const key = document.getElementById("textKey").value;
    const value = document.getElementById("textMemo").value;

    if (key === "" || value === "") {
      Swal.fire("エラー", "Key と Memo は必須です。", "error");
      return;
    }

    Swal.fire({
      title: "確認",
      html: `LocalStorageに<br>「${key} : ${value}」<br>を保存（save）しますか？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {

        localStorage.setItem(key, value);

        Swal.fire("保存完了", `「${key} : ${value}」を保存（save）しました。`, "success");

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
        viewStorage();
      }
    });
  });
}

// =======================================
// 表示処理（checkbox）
// =======================================
function viewStorage() {
  const list = document.getElementById("list");

  while (list.rows[0]) list.deleteRow(0);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";

    const td2 = document.createElement("td");
    td2.textContent = key;

    const td3 = document.createElement("td");
    td3.textContent = value;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    list.appendChild(tr);
  }
}

// =======================================
// 選択ボタン
// =======================================
function selectTable() {
  const select = document.getElementById("select");

  select.addEventListener("click", function () {
    let res = selectCheckBox("select");
    if (res === 1) { }
  });
}

// =======================================
// 複数選択 チェック関数
// =======================================
function selectCheckBox(mode) {
  const chk = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");

  let w_cnt = 0;
  let ids = [];

  for (let i = 0; i < chk.length; i++) {
    if (chk[i].checked) {
      w_cnt++;
      ids.push(i);
    }
  }

  // -------------------------
  // mode = "select"
  // -------------------------
  if (mode === "select") {
    if (w_cnt === 1) {
      let idx = ids[0];

      let key = table1.rows[idx + 1].cells[1].textContent;
      let memo = table1.rows[idx + 1].cells[2].textContent;

      document.getElementById("textKey").value = key;
      document.getElementById("textMemo").value = memo;

      return 1;
    } else {
      Swal.fire("エラー", "１つ選択（select）してください。", "error");
      return 0;
    }
  }

  // -------------------------
  // mode = "del"
  // -------------------------
  if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      Swal.fire("エラー", "１つ以上選択（select）してください。", "error");
      return 0;
    }
  }
}

// =======================================
// 複数削除（SweetAlert2）
// =======================================
function delLocalStorage() {
  const del = document.getElementById("delete");

  del.addEventListener("click", function (e) {
    e.preventDefault();

    let w_cnt = selectCheckBox("del");
    if (w_cnt === 0) return;

    Swal.fire({
      title: "確認",
      html: `LocalStorageから<br>${w_cnt} 件を削除（delete）しますか？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {

        const chk = document.getElementsByName("chkbox1");
        const table1 = document.getElementById("table1");

        for (let i = chk.length - 1; i >= 0; i--) {
          if (chk[i].checked) {
            let key = table1.rows[i + 1].cells[1].textContent;
            localStorage.removeItem(key);
          }
        }

        Swal.fire("削除完了", `${w_cnt} 件を削除（delete）しました。`, "success");

        viewStorage();
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  });
}

// =======================================
// 全削除（SweetAlert2）
// =======================================
function allClearLocalStorage() {
  const delAll = document.getElementById("allclear");

  delAll.addEventListener("click", function () {
    Swal.fire({
      title: "確認",
      text: "LocalStorageのデータをすべて削除（all clear）します。よろしいですか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "キャンセル"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        viewStorage();
        Swal.fire("完了", "すべてのデータを削除しました。", "success");
      }
    });
  });
}
