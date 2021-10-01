import { generateMap } from '../../util/screenshot.ts'

export default async function handler (req, res) {
  try {
    console.log(req.method)
    if(req.method === 'GET') {
      const map = await generateMap({ id: 6026323546, polyline: 'hz}mEisvy[`@]NIb@K`@c@|@eAJe@Pc@`@a@jAu@jA}@d@SdC_BHCNBVn@f@`@v@d@h@BlAXlAL`@GX]J_@Js@@c@Mm@_@Wy@CcAMwA{@c@Os@B_@IOMm@y@_@c@kAkBIEYHGPU`B]fAo@rA?VJ`@rBJh@@d@CnANZjADFpA|@r@DzBb@d@BZKHGN_@NaA@y@EWOQMI_@Iu@Eu@QqAu@e@Os@AQCc@]{@cAy@aByAqBYUq@UOEaBUWOWa@aAgAGS@_AIi@Sm@c@e@UEq@A]Ea@@UJKHWd@OfAAj@Hh@R^`@Zd@Jp@Dd@?`@S`@_@Pc@@e@Ee@Io@Oe@]Ua@Oq@Ge@?_@J_@ZQb@Kr@@p@Ln@`@f@b@PrAH\\AJEv@o@TEJ@HF^\\V`@N\\pAJdBl@RLLJnAhBr@pA`AtAZZDB\\@n@E\\Nb@TTT`@Nr@Jf@?f@JX^FX@NCl@AVKh@Uj@]Pa@?oCg@k@EWO}@u@Q[Mk@AUVu@Dq@Gk@_AiAm@oA[c@EKSKI@WPKbAMx@k@pAc@v@EPJj@dCPfC?PNJl@V^h@f@\\Rb@?fDb@N@ZKTc@Ji@Dw@Gm@KUII[GcAE]G}BgAQCy@A[QaAqAaAcB}@mAQYWSg@UeAWkAOc@q@eAgAE[?w@E[Su@OW]Sc@Ie@?[E_@Ha@`@Sd@Mt@?f@Fn@P\\XTZN`@F|@@f@OZYV_@Jq@@a@Ik@Uo@W[]MaBIa@JW^Ur@O~@Bf@Ll@RT^RZFtAB`@Q^_@Pe@Ho@Aw@Qi@U]a@Wm@Gs@@[Ba@VKNKXKp@O~AFb@FJ'});
      return res.status(200).json(map)
    } else if(req.method === 'POST') {
      //
    }
  } catch (error) {
    return res.status(500).json(error)
  }
};