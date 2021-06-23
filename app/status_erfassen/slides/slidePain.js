let slide = `
<GridLayout id="pain" row="0" rows="auto, *, *,*,*,*">
    <Label row="0" text="{{ painQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
    <Button row="2" id="0" text="{{ painAnswer0 }}" fontSize="{{ mySize }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
    <Button row="3" id="1" text="{{ painAnswer1 }}" fontSize="{{ mySize }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
    <Button row="4" id="2" text="{{ painAnswer2 }}" fontSize="{{ mySize }}" class="-btn my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
    <Button row="5" id="3" text="{{ painAnswer3 }}" fontSize="{{ mySize }}" class="-btn my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
