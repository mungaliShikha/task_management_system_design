module.exports = {
    generatePassword() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        var value = 8
        var randomstring = '';
        for (var i = 0; i < value; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
             randomstring += chars.substring(rnum, rnum + 1);
            console.log("===",randomstring,"Subhra",rnum)
        }
    },

    randomPassword(){
        var randomstring = Math.random().toString(36).slice(-7);
        return randomstring;
    }

}

