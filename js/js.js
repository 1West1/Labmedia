"use strict";

var min_age, max_age, age;
var orgs_array1 = [];
var orgs_array2 = [];
var orgs_array3 = [];

function readTextFile(file, callback) {

    var rawFile = new XMLHttpRequest();
    // переопределяем MIME тип
    rawFile.overrideMimeType("application/json");
    // get запрос к файлу
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        // Если код ответа сервера  200 и запрос завершен 4 то выполняется ответ сервера
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    // отсылаем запрос
    rawFile.send();
}


readTextFile("json/persons.json", function(text){
    // читаем объект из строки в формате JSON
    var data = JSON.parse(text);

    for (var key in data) {

        var ul = document.createElement('ul');

        for (var key2 in data[key]) {

            if (!(key2 === "id")) { // не выводим id
                var li = document.createElement('li');
                li.innerHTML = data[key][key2];
                ul.appendChild(li);
            } 
            data.sort(compare);
        }

        ul.classList.add("person");
        employees.appendChild(ul);  // добавляем в блок с id="employess";
    }

    personSelection();
});

readTextFile("json/positions.json", function(text){
    // читаем объект из строки в формате JSON
    var data = JSON.parse(text);

    for (var key in data) {

        var ul = document.createElement('ul');

        for (var key2 in data[key]) {

            if (!(key2 === "id")) { // не выводим id
                var li = document.createElement('li');
                li.innerHTML = data[key][key2];
                ul.appendChild(li);
            } 
            data.sort(compare2);
        }

        ul.classList.add("position");
        positions.appendChild(ul);  // добавляем в блок с id="positions";
    }

    positionSelection();
});

readTextFile("json/orgs.json", function(text){
    // читаем объект из строки в формате JSON
    var data = JSON.parse(text);

    for (var key in data) {

        var ul = document.createElement('ul');

        for (var key2 in data[key]) {

            if (!(key2 === "id")) {
                var li = document.createElement('li');
                li.innerHTML = data[key][key2];
                ul.appendChild(li);
            } 

            if (key2 === "id") {
                orgs_array1.push(data[key][key2]);
            }

            if (key2 === "name") {
                orgs_array2.push(data[key][key2]);
            }

        }

        ul.classList.add("orgs");
        orgs.appendChild(ul); // добавляем в блок с id="orgs";
    }
    // добавляем в orgs_array3 = [key => value];
    for (var i = 0; i < orgs_array1.length; i++) {
        orgs_array3[orgs_array1[i]] = orgs_array2[i];
    }

    orgsSelection();
});

readTextFile("json/subs.json", function(text){
    // читаем объект из строки в формате JSON
    var data = JSON.parse(text);

    for (var key in data) {

        var ul = document.createElement('ul');

        for (var key2 in data[key]) {

            if (!(key2 === "id") && !(key2 === "org_id")) { // не выводим id и org_id
                var li = document.createElement('li');
                li.innerHTML = data[key][key2];
                ul.appendChild(li);
            } 

            if(key2 === "org_id") { 
                var li = document.createElement('li');
                li.innerHTML = orgs_array3[data[key][key2]]; // доб значение из массива
                ul.appendChild(li);
            }
        }

        ul.classList.add("subs");
        subs.appendChild(ul);
    }

    subsSelection();
});


function personSelection() {

    var person = document.querySelectorAll('.person');
    var date = new Date();
    var todayDate = formatDate(date);

    for (var i = 0; i < person.length; i++) { 

        person[i].addEventListener("click", function() { // каждому блоку ul доб. click

            var buttonPerson = this;
            var class_add = document.querySelectorAll(".add")[0];
            var div = document.createElement("div"),
            span = document.createElement("span"),
            button = document.createElement("button");

            div.classList.add("block");
            span.classList.add("span_text");
            button.classList.add("delete");

            span.innerHTML = this.children[0].innerHTML + " " +
                            this.children[1].innerHTML + " " +
                            this.children[2].innerHTML;

            if (!(this.style.backgroundColor === "yellow")) { // если ul не подсвечен 
                this.style.backgroundColor = "yellow";

                class_add.appendChild(div);
                div.appendChild(span)
                div.appendChild(button);

                var block = document.querySelectorAll(".block");

                for (var i = 0; i < block.length; i++) {
                    if(!(i === 0)) { // если не первый блок(div), то удаляем
                        block[i].remove();
                        this.style.backgroundColor = "white";
                    }
                }
            } else { // если ul подсвечен желтым, то при клике на этот элемент
                this.style.backgroundColor = "white";

                var span_text = document.querySelectorAll('.span_text');
                for (var j = 0; j < span_text.length; j++) {
                    if (span_text[j].innerHTML === span.innerHTML) {
                        span_text[j].parentNode.remove(div);
                    }
                }
            }

            if (this.style.backgroundColor === "yellow") {

                var birthday = this.lastChild.innerHTML; // доступ к последнему элементу
                age = splitString(birthday, todayDate); // получаем возраст сотрудника

                if(min_age !== undefined && max_age !== undefined) { 

                    var text = "Выбранный сотрудник не подходит по возрасту. Вы уверены, что хотите выбрать этого сотрудника?";
                    var valueBoolen = minMaxAge(min_age, max_age, age, text);

                    if(valueBoolen === "not") {
                        this.style.backgroundColor = "white";
                        div.remove();
                        console.log(min_age + " " + max_age);
                    }
                }
            } else {
                age = undefined;;
            }
            
            button.addEventListener("click", function() { // при клике на крестик у даляем блок;
                age = undefined;
                div.remove();
                buttonPerson.style.backgroundColor = "white";
            });
        });
    }
}

function positionSelection() {

    var position = document.querySelectorAll('.position');

    for (var i = 0; i < position.length; i++) { 

        position[i].addEventListener("click", function() {

            var buttonPerson = this;
            var class_add = document.querySelectorAll(".add")[1];
            var div = document.createElement("div"),
                span = document.createElement("span"),
                button = document.createElement("button");

            div.classList.add("block2");
            span.classList.add("span_text2");
            button.classList.add("delete");

            span.innerHTML = this.children[0].innerHTML;

            if (!(this.style.backgroundColor === "yellow")) { // если ul не подсвечен

                this.style.backgroundColor = "yellow";

                class_add.appendChild(div);
                div.appendChild(span)
                div.appendChild(button);

                var block2 = document.querySelectorAll(".block2");

                for (var i = 0; i < block2.length; i++) {
                    if(!(i === 0)) { // если не равно нулю то удаляем остальные блоки
                        block2[i].remove();
                        this.style.backgroundColor = "white";
                    } 
                }

            } else {

                this.style.backgroundColor = "white";

                var span_text2 = document.querySelectorAll('.span_text2');

                for (var j = 0; j < span_text2.length; j++) {
                    if (span_text2[j].innerHTML === span.innerHTML) {
                        span_text2[j].parentNode.remove(div);
                    }
                }
            }

            if (this.style.backgroundColor === "yellow") {

                min_age = this.children[1].innerHTML;
                max_age = this.children[2].innerHTML;

                if(!(age === undefined)) {

                    var text = "Выбранная должность не подходит по возрасту сотруднику. Вы уверены, что хотите выбрать эту должность?";
                    var valueBoolen = minMaxAge(min_age, max_age, age, text);

                    if(valueBoolen === "not") {
                        this.style.backgroundColor = "white";
                        div.remove();
                    }
                }
            } else {
                min_age = undefined;
                max_age = undefined;
            }

            button.addEventListener("click", function() { // удаляем блок при нажатии кнопки с крестиком
                div.remove();
                min_age = undefined;
                max_age = undefined;
                buttonPerson.style.backgroundColor = "white";
            });
        });
    }
}

function orgsSelection() {

    var orgs = document.querySelectorAll('.orgs');

    for (var i = 0; i < orgs.length; i++) { 

        orgs[i].addEventListener("click", function() {

            var buttonPerson = this;
            var class_add = document.querySelectorAll(".add")[2];
            var div = document.createElement("div"),
                span = document.createElement("span"),
                button = document.createElement("button");

            div.classList.add("block3");
            span.classList.add("span_text3");
            button.classList.add("delete");

            span.innerHTML = this.children[0].innerHTML +
                             this.children[1].innerHTML;

            if (!(this.style.backgroundColor === "yellow")) {

                this.style.backgroundColor = "yellow";

                class_add.appendChild(div);
                div.appendChild(span)
                div.appendChild(button);

                var block3 = document.querySelectorAll(".block3");

                for (var i = 0; i < block3.length; i++) {
                    if(!(i === 0)) { // если не равно нулю то удаляем остальные блоки
                        block3[i].remove();
                        this.style.backgroundColor = "white";
                    } 
                }

            } else {

                this.style.backgroundColor = "white";

                var span_text3 = document.querySelectorAll('.span_text3');
                for (var j = 0; j < span_text3.length; j++) {
                    if (span_text3[j].innerHTML === span.innerHTML) {
                        span_text3[j].parentNode.remove(div);
                    }
                }
            }

            button.addEventListener("click", function() {
                div.remove();
                buttonPerson.style.backgroundColor = "white";
            });
        })
    }
}

function subsSelection() {

    var subs = document.querySelectorAll('.subs');

    for (var i = 0; i < subs.length; i++) { 

        subs[i].addEventListener("click", function() {

            var buttonPerson = this;

            var class_add = document.querySelectorAll(".add")[3];
            var div = document.createElement("div"),
                span = document.createElement("span"),
                button = document.createElement("button");

            div.classList.add("block4");
            span.classList.add("span_text4");
            button.classList.add("delete");

            span.innerHTML = this.children[0].innerHTML +
                             this.children[1].innerHTML;

            if (!(this.style.backgroundColor === "yellow")) {

                this.style.backgroundColor = "yellow";

                class_add.appendChild(div);
                div.appendChild(span)
                div.appendChild(button);

                var block4 = document.querySelectorAll(".block4");

                for (var i = 0; i < block4.length; i++) {
                    if(!(i === 0)) { // если не равно нулю то удаляем остальные блоки
                        block4[i].remove();
                        this.style.backgroundColor = "white";
                    }                    
                }

            } else {

                this.style.backgroundColor = "white";

                var span_text4 = document.querySelectorAll('.span_text4');

                for (var j = 0; j < span_text4.length; j++) {
                    if (span_text4[j].innerHTML === span.innerHTML) {
                        span_text4[j].parentNode.remove(div);
                    }
                }
            }

            button.addEventListener("click", function() {
                div.remove();
                buttonPerson.style.backgroundColor = "white";
            });
        })
    }
}

// сравнения по фамилии
function compare(a, b) {

    if (a.lastname < b.lastname) return -1;
    if (a.lastname > b.lastname) return 1;
    return 0;
} 

// сравнения по имени
function compare2(a, b) {

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
} 

// вывода даты в формате дд.мм.гг
function formatDate(date) {

    var dd = date.getDate()
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

// вывод возраста 
function splitString(date1, date2) {

    var age;

    date1 = date1.split("."); // разбиваем строки на массив
    date2 = date2.split(".");

    date1 = date1[date1.length - 1]; // возвращаем последний элемент массива
    date2 = date2[date2.length - 1];

    age = date2 - date1; // возраст сотрудника по году рождения

    return age;
}

// проверка на возраст
function minMaxAge(min_age, max_age, age, text) {
    if(min_age > age || max_age < age) {
        if ( confirm( text ) ) {
        } else {
            return "not";
        }
    }
}







