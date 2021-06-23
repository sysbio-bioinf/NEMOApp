let slide = `
<GridLayout id="medication" row="0" rows="auto, *, *, *">
    <Label row="0" text="{{ medicationQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
    <Button row="2" id="0" text="{{ medicationAnswer0 }}" textWrap="true" fontSize="{{ mySize }}" class="-btn my-button-gradN0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
    <Button row="3" id="1" text="{{ medicationAnswer1 }}" textWrap="true" fontSize="{{ mySize }}" class="-btn my-button-gradN1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};


