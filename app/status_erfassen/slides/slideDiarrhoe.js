let slide = `
<GridLayout id="diarrhoe" row="0" rows="auto, *, *, *, *, *">
    <Label row="0" text="{{ diarrhoeQuery }}" fontSize="{{ mySize }}" textWrap="true" class="question text-center" />
    <Button row="2" id="0" text="{{ diarrhoeAnswer0 }}" fontSize="{{ mySize }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
    <Button row="3" id="1" text="{{ diarrhoeAnswer1 }}" fontSize="{{ mySize }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
    <Button row="4" id="2" text="{{ diarrhoeAnswer2 }}" fontSize="{{ mySize }}" class="-btn my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
    <Button row="5" id="3" text="{{ diarrhoeAnswer3 }}" fontSize="{{ mySize }}" class="-btn my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};