//First I want to do like a "Smashing the keyboard to write the Lorem Ipsum"
//Then I will work on the searching algorithm
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam sem et tortor consequat id porta nibh venenatis. Sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Sed blandit libero volutpat sed. Enim ut tellus elementum sagittis vitae. Posuere urna nec tincidunt praesent. Non diam phasellus vestibulum lorem sed risus ultricies tristique nulla. Etiam sit amet nisl purus in mollis nunc sed id. Dui ut ornare lectus sit amet est placerat in egestas."
let index = 0;
let matches;

$('#loremInput').on('input', function(ev) {
    const key = ev.originalEvent.inputType;

    if(key == 'insertText'){
        index++;
    } else if(key == 'deleteContentBackward'){
        index--;
    }

    $('.loremIpsum').html(`${lorem.substr(0, index)}`);
});

$('#clearTextArea').on('click', function(ev) {
    hideSearchedWord();
    $('#loremInput').val('');
    $('.loremIpsum').html('');
    index = 0;
});

$('#copyToClipboard').on('click', function(ev) {
    alert('Im working on that, thanks for patient');
});

$('#nextMatch').on('click', function(ev) {
    const coincidences = $('.loremIpsum').children().length;
    let selectedSpan = $('span.selected-span').index();

    selectedSpan++;

    $(`.loremIpsum span:nth-child(${selectedSpan})`).addClass('coincidences');
    $(`.loremIpsum span:nth-child(${selectedSpan})`).removeClass('selected-span');

    selectedSpan++;

    if (selectedSpan > coincidences){
        selectedSpan = 1;
    }

    $(`.loremIpsum span:nth-child(${selectedSpan})`).addClass('selected-span');
    $(`.loremIpsum span:nth-child(${selectedSpan})`).removeClass('coincidences');
});

$('#previousMatch').on('click', function(ev) {
    const coincidences = $('.loremIpsum').children().length;
    let selectedSpan = $('span.selected-span').index();

    $(`.loremIpsum span:nth-child(${selectedSpan+1})`).addClass('coincidences');
    $(`.loremIpsum span:nth-child(${selectedSpan+1})`).removeClass('selected-span');

    selectedSpan;

    if (selectedSpan <= 0){
        selectedSpan = coincidences;
    }

    $(`.loremIpsum span:nth-child(${selectedSpan})`).addClass('selected-span');
    $(`.loremIpsum span:nth-child(${selectedSpan})`).removeClass('coincidences');

});

$('#showSearchBar').on('click', function(ev) {
    const text = $('#search-input').val();
    if (text.length > 0){
        searchedWord(text);
        $('.searched-word-container').removeClass('hide');
        markupWords(text);
    }
});

function markupWords(text){
    $('.loremIpsum').find('span').contents().unwrap();
    let mainText = $('.loremIpsum').html();
    let answer;

    text = text.toLowerCase();

    if(mainText.match(new RegExp(text, 'gi'))) {
        mainText = mainText.replace(new RegExp(text, 'g'), `<span class="coincidences">${text}</span>`);
        textCapitalized = text.charAt(0).toUpperCase() + text.slice(1);
        answer = mainText.replace(new RegExp(textCapitalized, 'g'), `<span class="coincidences">${textCapitalized}</span>`);
    }

    $('.loremIpsum').html(answer);
    $('.loremIpsum span:first-child').removeClass('coincidences');
    $('.loremIpsum span:first-child').addClass('selected-span');

}

$('#closeSearchBar').on('click', function(ev) {
    hideSearchedWord();
    $('.loremIpsum').find('span').contents().unwrap();
});

function hideSearchedWord(){
    $('.searched-word-container').addClass('hide');
}

function searchedWord(word) {
    $('#search-input').val('');
    $('#word').text(word);
}
