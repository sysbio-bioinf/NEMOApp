let slide = `
<GridLayout id="pnp" row="0" rows="auto, *, *,*,*,*" xmlns:ui="nativescript-auto-fit-text">
<Label row="0" text="{{ pnpQuery }}" fontSize="{{ mySize }}" textWrap="true" class="question text-center" />
<Button row="2" id="0" text="{{ pnpAnswer0 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
<Button row="3" id="1" text="{{ pnpAnswer1 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
<Button row="4" id="2" text="{{ pnpAnswer2 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
<Button row="5" id="3" text="{{ pnpAnswer3 }}" textWrap="true" fontSize="{{ mySizeSmall }}" class="-btn my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
