function $ (id) {
    return document.getElementById(id);
}

function charOffset (char, offset) {
    if (offset < 0)
        offset += 26;
    if(/[a-z]/.test(char)) {
        return String.fromCharCode((char.charCodeAt(0)-97+offset)%26+97);
    }else {
        return String.fromCharCode((char.charCodeAt(0)-65+offset)%26+65);
    }
}

function Vigenere (strIn, key, encode) {
    var strOut = "";
    var j=0;   
    for (var i = 0; i < strIn.length; i++) {
        var c = strIn[i];
        if( /[a-zA-Z]/.test(c) ){
            var offset = key.charCodeAt( j%key.length ) - 97;
            j++;
            if(encode == false)offset = -offset;
            strOut += charOffset(c, offset);
        }else {
            strOut += c;
        }
    }
    return strOut;
}


function deVigenereWithKnownWord() {
    console.log("Decrypt with Known Word");
    var ciphertext = $("ciphertext").value;
    var knownWord = $("knownWord").value.toLowerCase();
    var key = findKeyFromKnownWord(ciphertext, knownWord);
    
    if (!key) {
        alert("Couldn't find a valid key with the known word.");
        return;
    }
    
    $("plaintext").value = Vigenere(ciphertext, key, false);
}


function charOffsetRu(char, offset) {
    if (offset < 0)
        offset += 32;
    if(/[а-яА-Я]/.test(char)) {
        return String.fromCharCode((char.charCodeAt(0) - 1072 + offset) % 32 + 1072);
    } else {
        return char;
    }
}

function VigenereRu(strIn, key, encode) {
    var strOut = "";
    var j = 0;
    
    for (var i = 0; i < strIn.length; i++) {
        var c = strIn[i];
        
        if (/[а-яА-Я]/.test(c)) {
            var offset = key.charCodeAt(j % key.length) - 1072;
            j++;
            if (!encode) offset = -offset;
            strOut += charOffsetRu(c, offset);
        } else {
            strOut += c;
        }
    }
    
    return strOut;
}

function deVigenereWithKnownWordRu() {
    console.log("Decrypt with Known Word");
    var ciphertext = $("ciphertext").value;
    var knownWord = $("knownWord").value.toLowerCase();
    var key = findKeyFromKnownWord(ciphertext, knownWord);
    
    if (!key) {
        alert("Couldn't find a valid key with the known word.");
        return;
    }
    
    $("plaintext").value = VigenereRu(ciphertext, key, false);
}

// The rest of your existing code remains the same.


function findKeyFromKnownWord(ciphertext, knownWord) {
    var key = "";
    var knownWordIndex = 0;
    
    for (var i = 0; i < ciphertext.length; i++) {
        var c = ciphertext[i];
        
        if (/[a-zA-Z]/.test(c)) {
            var offset = (knownWord.charCodeAt(knownWordIndex) - 97) % 26;
            key += String.fromCharCode((c.charCodeAt(0) - offset - 97 + 26) % 26 + 97);
            knownWordIndex = (knownWordIndex + 1) % knownWord.length;
        } else {
            key += c;
        }
    }
    
    return key;
}

function enVigenere (argument) {
    // body...
    console.log("Cipher")
    var plaintext = $("plaintext").value;
    var key = $("key").value.toLowerCase();
    if(!key){alert("Write the key, please"); return;}
    $("ciphertext").value = Vigenere(plaintext, key, true);
}

function deVigenere (argument) {
    // body...
    console.log("Decrypt")
    var ciphertext = $("ciphertext").value;
    var key = $("key").value.toLowerCase(); 
    if(!key){alert("Write the key, please"); return;}
    $("plaintext").value = Vigenere(ciphertext, key, false);
}

function deVigenereAuto (arguments) {
    console.log("autokey");
    var ciphertext = $("ciphertext").value;
    var best_len = parseInt($("keyLen").value);
    var best_key = "";
    var count = [];
    var cipherMin = ciphertext.toLowerCase().replace(/[^a-z]/g, "");
    var freq = [8.167,1.492,2.782,4.253,12.702,2.228,2.015,6.094,6.966,0.153,0.772,4.025,2.406,6.749,7.507,1.929,0.095,5.987,6.327,9.056,2.758,0.978,2.360,0.150,1.974,0.074];
    if(!best_len) {
        for(var best_len = 3; best_len < 13; best_len++) { 
            var sum = 0;
            for (var j = 0; j < best_len; j++) {
                for (var i=0; i<26; i++) {
                    count[i] = 0;
                }
                for (var i = j; i < cipherMin.length; i+=best_len) {
                    count[cipherMin[i].charCodeAt(0)-97] += 1;
                }
                var ic = 0;
                var num = cipherMin.length/best_len;
                for (var i = 0; i < count.length; i++) {
                    ic += Math.pow(count[i]/num,2);
                }
                sum += ic;
                
            }console.log(sum/best_len);
            if(sum/best_len > 0.065)break;  
        }
    }
    console.log(best_len)
    for (var j = 0; j < best_len; j++) {
        for (var i=0; i<26; i++) {
            count[i] = 0;
        }
        for (var i = j; i < cipherMin.length; i+=best_len) {
            count[cipherMin[i].charCodeAt(0)-97] += 1;
        }
        var max_dp = -1000000;
        var best_i = 0;

        for (var i = 0; i < 26; i++) {
            var cur_dp=0.0;
            for (var k = 0; k < 26; k++) {
                cur_dp += freq[k]*count[(k+i)%26];
            }
            if (cur_dp > max_dp) {
                max_dp = cur_dp;
                best_i = i;
            }
        }
        best_key += String.fromCharCode(best_i+97);
    }console.log(best_key)
    $("best_key").innerHTML = "Most likely the key is："+ best_key;
    $("plaintext").value = Vigenere(ciphertext, best_key, false);
}

window.onload = function  (argument) {
    $("encryption").onclick = enVigenere;
    $("decryption1").onclick = deVigenere;
    $("decryption2").onclick = deVigenereAuto;
	$("decryption3").onclick = deVigenereWithKnownWord;
	var languageSelect = $("language");
    var encryptionButton = $("encryption");

    // Set up the click event based on the selected language
    encryptionButton.onclick = function() {
        var selectedLanguage = languageSelect.value;
        if (selectedLanguage === "english") {
            enVigenere();
        } else if (selectedLanguage === "russian") {
            enVigenereRu(); 
        }
    };
}
