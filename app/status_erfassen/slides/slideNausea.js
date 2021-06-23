let slide = `
<GridLayout id="nausea" row="0" rows="auto, *, *,*,*,*">
<Label row="0" text="{{ nauseaQuery }}" fontSize="{{ mySize }}" textWrap="true" class="question text-center" />
<Button row="2" id="0" text="{{ nauseaAnswer0 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
<Button row="3" id="1" text="{{ nauseaAnswer1 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
<Button row="4" id="2" text="{{ nauseaAnswer2 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
<Button row="5" id="3" text="{{ nauseaAnswer3 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
