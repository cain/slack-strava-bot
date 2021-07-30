import { generateMap } from '../../util/screenshot.tsx'

export default async function handler (req, res) {
  try {
    console.log(req.method)
    if(req.method === 'GET') {
      await generateMap({ polyline: 'vw}mEyuvy[Ok@OmA?UBGLEJA|AIVK^e@xCuClAcAVGzBHnBBPJLf@Th@f@d@d@Vd@@vD`@`@MZc@Ns@By@Eg@[_@}BOe@QsAq@QEs@Ac@McAiAo@yA_@i@MOK@OHGJGl@Q`AoAlC?ZL`@nA?b@Bl@JpB@FJNn@Rd@z@r@NF`@AdALpATd@?TMLQPi@D_@?u@I]GMa@We@G}@Gc@M}Aw@sAEc@Si@q@Yc@Yu@We@[_@IAOFGHMfAOx@oAdCAJDTA`@gCzBa@b@eBdBa@LqAF]?GEIOEk@Cu@BcANi@ZU^Sf@Mh@@ZTZf@^|@\\ZJBBAPO`BcBPW`@SfCPl@Gl@?^BPTTz@\\\\b@Z`@NX?x@JhBXP?VKVg@Fi@Bu@Ko@W[[GaAAg@KiAu@g@WqAAYOmA_Bg@aAiAyAWa@WW_@Qe@M_BWUIc@w@e@k@Qa@EUEgAOc@g@s@QIc@Ky@Gc@Je@`@KRSp@El@@NLj@T\\PN`@RPD`ABRAb@Kd@[To@Bu@Km@[o@e@a@]Im@Gg@?e@HWNMNUfACn@Jv@LN'});
      return res.status(200).json('screenshot done.')
    } else if(req.method === 'POST') {
      //
    }
  } catch (error) {
    return res.status(500).json(error)
  }
};