export function selectTrait() {
  let traitId = this.getAttribute('traitId');
  let traitType = this.getAttribute('traitType');

  window.Alpine.store('avime').selectedTraits[traitType] = parseInt(traitId);
  window.Alpine.store('avime').selectedSeasons[traitType] = 1;

  document.getElementById(`fusion_trait_${traitType}`).html(traitId);

  console.info(
    window.Alpine.store('avime').selectedTraits,
    window.Alpine.store('avime').selectedSeasons
  );
}
