let slide = `
<GridLayout id="vomit" row="0" rows="auto, *, *,*,*,*">
<Label row="0" text="{{ vomitQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
<Button row="2" id="0" text="{{ vomitAnswer0 }}" fontSize="{{ mySize }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
<Button row="3" id="1" text="{{ vomitAnswer1 }}" fontSize="{{ mySize }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
<Button row="4" id="2" text="{{ vomitAnswer2 }}" fontSize="{{ mySize }}" class="-btn my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
<Button row="5" id="3" text="{{ vomitAnswer3 }}" fontSize="{{ mySize }}" class="-btn my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
