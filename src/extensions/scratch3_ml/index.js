const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const log = require("../../util/log");
const ml5 = require("ml5");

/**
 * Formatter which is used for translating.
 * When it was loaded as a module, 'formatMessage' will be replaced which is used in the runtime.
 * @type {Function}
 */
let formatMessage = require("format-message");

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */

const HAT_TIMEOUT = 100;

const blockIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAaTUlEQVR4nN18eZRdVZ3ut6cz3VvDrbluhUpCICEJgZCQkICAoICAoKiIA7oQBJ9Ds/ThE+2lNv16PXVht1O3StugrbZiRxuBbhQFlrRowpRAwpA5IUnN4626dc+0z96/98ethJAEqUoVPX1/1Mo5OcP+9u/s37wvIyIchjiO8T8LnucdfiiP+O8j+P/Pw5GEGWPHx5kAEAWOgBQAAQypCTPL2CyM8rjBjnr9kYSPDwRwwAtUX0X/4sD4QGoX+uI9bfnAl2Gkj37rfyKOlGccx8chYUbwAvWbofDdWwbGRyIQQYhT2oJ7lzUvyrlh/DJnAiSDw9jR72BARkiJZnF6GGOvsYaPD54rdo/Hb3mmH5G+ZXHDqvrglwMT/7y79CbQzpVFT4rE2MkRHBrKMUYHTsc6P6uYHcIQ/Ds9ExiN/nJ5yxcXtgG4pqM+A/7lpfFfDlbeN6cO0SRhz5X39k/85Z6SlTyyk8IkQDHmaPOeYu7W+YUkMa+f5pwFwgwAaGtsIPHRYh0AImKMfeSE+n/ZObo9tq+4mPPu1G4eipFTkzczBktgwHi6pN5h/PWVMZ/5IwgA2DyXw+LewQkc1I3rescheadzxCso4AxkP9tZWzq/s3tNsfusYun8zrsXN4BTjRBHPpzgc+ZLPlvmcpY+aWNvast996Wxm7YOVwhLPfmbUnTnvvLijvz1bTmbZEdeT2iUrE6JOhCIoGSBM1jrcXb46iaiQAkQBrVp9tThyu+4MTuEk8Qsr/fvWt5yw+bBT23sA7PgHJ6bGqpYyjuCYvOKoTKElgAbZRaADzthCYyNZwaA5zvQWahN4EhI/p4t/Y8Nhr9f3b6gxgvDdIacZ4ewYUgSc3177Spf/aI/3JPZN9a7j48ld24beeuLQ4+uaHMESydVFCsbQkWPZPZwnR0agsU/dle2R93vb859oDVXG/ggfc2WvnV7xmGxZlPfi2s6mgNnhpxnZIclg2AstURV34rguwKCgwhMwGYnb+je1Vv52qrWT81tiMOUGBzJny+nvx2orG3019Z7aWYBOFK8FCa3d40/Us5291eQmqbW3Bfn1/+hFK3bNnpGZ81Jgfz5ztKiFn/96o4GR0yd89F2+HgIE5EvOHMljIWxcCSMjRJDbFJkDLBEQeBsHo2Wr++GYDvO7ji51g1DDSCQHI6qfrTVcRNRIAUcQdr8eym+sz/8yYFxRBkEP7XZf3JVu6/klc/2/OvOsUXtwYazigUlp8h5FggTIVACnO7oKt89GA1qe3ZefaqzZmmdH0f68DsZwQucv9oz/MWN/UtPqHl+ddEaijP7J4bpcwZXAnimFN+0fVgbu+HMdl8KGAslLt3U8+CusVM6cutXFQtKTMVpnQXCkjMl+Tu3Dt2zfQSKwZUYT1DnPbyi9U1NQRRmhxYmAa5gQok1G3uf2Dt26+nNX1nYApPhFbMCEGBJW5vR5F0CcD1J2qSWXCnCNAMQuBJk3/H80C/3j5/a6N9zeuuJrqiuiNeRMAGBr+7aV/rw033LWvx/XNq6IHC+1136zPPDNXVq/NwTIBRgYWyUmsn4yVfdoT7hj12U2XuWt66uc8vaHHqgJUiGZiUKroCUsFYnmQZACAQDQ5hRVYrGUj7njUdx6/rueDz9wRmt182rjyL9+hKWYMpla54ZeGL/2LY3zl1UqKmef++zXT/bN/7lpY1rGoLxSM/x5Yo6L66uaoIXOD/oHrv+qV5IAYe/QsIEgIQnz8k7F9U7b230lxcCWIri7JBGqF7lSc4Fu2zLwK/3jL335PqfntqaJvo1XdCZEnYYEwILNvbvGQ7p4pOgFIjA2Nd39f/vrSMgwFoACOTTq4sr6/0wTMGYYkw54pM7h58aSYzkh/uOkkETng/1xHiCKENeXV3Mf2Fe3bI63yZZbCbFKwDHU5/ZMfTV54eWdeS3rCqCKExfO9ieKWEGeL664cWh778w8IWlTf93SRHAaCU684muPRld2x44jA9k5t8OVNrr1N61c1zOwsQAcDiTDoc99pNDbV4Is9+MJd/uLvf1VZBXf7248ZZ5BWhT1eS+J+/vm3jbk721dc6e1e2NvhtG/1Fa2nfE/lAveLInG0su7aztdPjdQ9H4UHzDqY13Lmmt2uN3bu67Z/vIZYsKD5zeZpIssQRAAOKoIRKIgUkOKAHGk0R/rbv85ztGMKE/uLjhh0uakVGojaf47kiv2tinM7v1rGJn3gkTMxVDfDRhcdtttx1+nGVH+b2vhMmoMacuLrhPpGZ9X2XjUJhI8fGFhTtObjSZTZJMcfaOJv+uUrLpQNn3xblNNYqsIRDgclb9oBNLkjHJmWCMCIklnVmtM1/yc5vyVzT7947H6/eN74Z9R1strE0z25b3cgz37x7tdeS7WmtsNqUQkjEm5Su8yenbYQCEwJfI7B9GoiFjl+XUgjoP2lY/PyIKArW5FC/f0ANLj6xuu7AxiBIDwGXIGBgho6q0iQNSckiBzIapAQMj+IGzP0xOf7y7NJr83aq2j3fWx2HqKVHWpvGJHm0xcFZ7syuj17JJOJaEpx0eVgPYMMpg6Q0tubcXaxfk3CTKwsxWFxVjLA6z0+uDO5c1IbNv2jQwd33XYGosYcHGvjm/P3DjrhHfd79yoDTnj11zn+5bs7H/L3cO96UmCJQAiCEKk87A/c0ZrfDkJ7aN9EwknitjbWsC532tOYxGD45GUI6vuK+47wifs1dRDsfA9AhXvQJfiSCQkNwkWRjqSJvD4wAAlkHH+oY5ddefXA9L+0NtAM7wUpwNhlm3JgDDaTYY6Z7UPDEU3vbswKLHux8YrLi+4gAxlkTp6kLu5pMLKCVf7ipD8CqjdxVcSP7Dwag7inZX9M6K3l5OBrRRU04bTOOTnoxOJd8xFu8MszmuOL3ggViYHMPFI4IjmGSsN83AWC1ngmHUEBE5jOU5i4hiS4qxrsx+r6f83Z2j4PyPZxfPbvDDMAND4IhSnDVt6HYUH1hdzAsGxko6Kzzei0qGal5BcmHs108u/Nn8+ig6hvY5/iQeEQJHpsZe/8LgT7omEKVw5ZtbgzsXNc4NnOio0JwxaEOCo92VAJLMEqFdiWpgERlbEByKgdAUqO/UBUt9+YlnB9+9dXjf6qInWGIpTUx9Tr21NXffrtHfleIr2muyWNcreUtH/snRJJHc59gVme6ROJlOnnOqhB0OcPaOF4Yf2D7S2hq8qb2wpZI8vHfsvDjbt6bDDzzAHOs+VrWlga/AWBJpQxRI4QfuoWiJjPW5+fi8wn2l5KG9Y/f0T1w9pxZRljE4YBfXuvdZei5MrwBSQpbZv15QODh2edf+0ocHQjWd6HiqhKWrftNffmDf2Kpi8PtVJ3iuAzLXbO5dt7980eb+RYGTHqU3CEi1ubYtf2FT8JkdwyOZuX1+oc5Vjw6H391fen9H7eXNuVQbBkSGArCbWoKH9ow+Wk6vnpwqAJjrCki2OzZVlU6AziwHI0BKiuy087pTzngwPDWhEWefW1D0XKca4n91fmFd/8TD/dHDyTiO6fdUdNGTF7XWfHX3KCL9xbn1DUJtmEjXPdNX46kr22ugDVC9ldqUgOCD2uJgEAXAZwSgdJjRzaqGEZCg40jnTiPFE3AGxrZVUhwc49ZYo6IvmV/4TGdtoo/xSYeGTs07aZo9uKIttFTPeZom1zT5nW9ZsDzvpemkmiEigG2PNTKa70ng5fiiZAFCm+KHn5wJpkzY2MsbvVtqnc/vGD7Vl+c11WyvJNdvGwLjX+jIn9NYCzqWi8YAbSqpuaQ1X13DWpsTPXVirQ+dVVLDOSOiwJOw5m+6ynDEZfUeDgbGAPbGGSyd6ElgsjoTSA7OQASIGsGmOw1TJRwnZlGd952lTR/b1H/lE93IOUgyZHT9ksZzmnM6jrOjjJklykkOJXKSgwAi15XuZMRvIXjO52AA47DZ+54f2to1cd6Jtec3+VliACgAZH89lkDylTkFIg44nA0mZlwbxlmNSwcSg2km7qdK2DKksfloR12nI77VVX4xzE4oeDe052/oqLHaaktHLGEieEpEmd0wMsH5seMawVgKvBBl3+oa39VdaWn2717cDGKpJTAoR/ROpI/0h/mCt7bWJW1cwSzRG14c3DGSVMNSgJDZ8ewIx2c2CDMgs0Sxvrwlf3lzziRaSAEpTJLFxh7NSHEmlLhux8i6XaOT7ugxQQRt4Mi3Lqj7+8VNRV9Vs3OcCEJ8ubeCseQT82tdT0Wh9n21YWhix2Do5p0L6t3QkMuZk9nTcsqa1/arp0cY1RoQEEVaAA7nEByAcEUOEunLvnSVhvKdn/eMrds54hX8y5pz1tLRDhwBjGiZyy+q985ryYGoypaI3MB5cSz8210l1uB9Zk4tMstAYPjRUIRQf21p08fmNcHqyWFpGybZFBO3007EU/UdjnimFP/bQGXI0Moa59rWfHCwFEKEwFOlOLlu2zA4e2Bxw4UtdUD2qtqFMRCZJEvsZP9B4Ctr7NufG0KYfm1pWyFwozDxHVkKkx/0VFjBf3dTgCxN9aRU7bEq/bNGWACOJ79xYOxTzw+iosEI4F/vyN+3rLnTc8IkU5yBs2u3j4RD8YdPa76wpUZH8TG9sCpengcGEILAyYy9eFPvzp6JSxYWPjm3XieagUGKv9ozmo3EH13W2JR3k1D/qXzvq2P6GQ9PPjIUvvnxHkj2rcVNczz1o56xe/eMrZhbu3FVERbg4sddox98sq+9Jdh3VlExTHFsvhKQcns5vOa5wc1dE6vm1jy+op1zFiYm8OQfBifO3dgf+Gp0bdFxZCXOpqKeZ9oBUA0mb+8uI9H3nDHnqjkNAK5qq70gtY/2hQ/2lc8uBHuj6MYdo5D8J6c0KCUqlTSQnAkGQpxZS/A444ojsxVjc0pA8qq+HajoO/aN/cXOEZTTt5xUf/+yFi74oWVCgkOwMDY/HYmuK9ZKBjN11XzchBVj0GZHlCGnrmqrBVA1D1e3BI8OhJc+NwQAllDJblzaeEFTPg7TnBJgeKmiueBNggmOMWtLFVMrWY3geyPdl5rdiXl0LLmrdwLDEercL61s+9z8elg6VB+NE31uU+53K9sueKr3Q5v6A8Hf3ZqPQ30c7SDTSwBoIiix2JeoZPf2jgFVe0M/HaxAijm+mpd3OgJ10dyab8+rtzpTksHh798+PP+x7rkbukatdT3vJ4PRiQ/s/Gb3hOPKtZv7z/73Ax94oueubcOcsY8ubdq2pvi5ExuOVLyMRaF+Y1PtQ6vaIfk1T/f+sqfsecdT+pzePVXdc2tHza8PlK96fvDr2rZ76qd94388UFk5t+apFW3MUGqsIwUI2ljlqVt2DP10+wirc9/aEigwsmauI9a05xcFigxdWvAPuGpZrXN2Xp1f77XkXVgbhQkBgaeAakaegeAIBpgDcQYicC6OtzNi2kqLA64nv9E19qnnh1FJQQTBVxTzvzqtpdVXSA0YM5YyItd3vrl/9JNP97s16pmz2hfXBkmUWiJfcLgC2kba+o6AYJNuiTaRNgzMcwWEeGywHBO7qCWXRpoxpjx5+57hW7cMSV/9/qzi2no/CpNX9WcO0ZuF6iEgGXM8sXk0+tVQPG6x0OcfaM1J1wUMCGAMxkKIe/vHr3qiF5I/tqb4hoZcGqXmYAubYLAEc/ADM0SCMccRVWfmpXLyD30TX9pVAuH7pzd/qKMOYLfvGbx18zBc/uia4vkNuThKp+JPzlJ9uNp350pwNtllCLa7HP9TT3lTlJ3kiv/VURtZe/rjPUjMj1e1XVusOzS+Q41pmkgfjN6rcupJzfpy8q+jybreCZRi1ZzT2qCSfWNFS56zD2/sh+L3rWq/sjk/RbazRvgI9r4vHx+JLny2PxqJIADL0BjkBKuUkq8sa7p1fkMap9lhmQnFmBTMGEoPvsj31IMD5SufG9CRRZLVNgUfa89/vKNmX5JduKk/jXTVdN13ZtuVzfkkSqdukGYhL30EPMlHYn3JcwPRhP7caa1/eMPcO1e1I9WVMf3RhYVb5zeYRB/O1nPlr0bj5Y/t/35/xXMPNikxjGirK+b0ltwvzpnTtbr9y4ua5vjynMbclrXFYp0HS/evnDbbY2KmTS3MEffuK48PxzeeXP+lRa0AzgE8hms39hUVBygxr4gcGef7UrO5r9LXWce48t3JYXS4Aia7pOC+s70AnYRRCgCULcq7G1a0bg3TS1pyM2eLWeni6TeAsVe05HGwB++S5hqw3t+O688TCYZXRm6U4wx5pyc1W8YrcWoICBy9cUJDyrHMAvrltgjGwjDt9GRnzolCfXjF+LgxC4QXehyO+PsDY1e01VVdhW/uG0FKqwIJxo6KU9mYscjojr1jd+wpHXaaIbXDOjtChIyxKLPILGaDLWZO2CTZ25pzi9pzD7w0fgU/8N7m3IaJ9O92jrAG/+b2HI6qdxljTw3UO+bXGSkOdQpXm0tlat5c8MyUQ/njw0y1NBECT7wU6nc9P7ixtwJjwdDUFPx8WcsbC14c6SNyP0QUSA7nVSY6s2E61VB+KngdzFKVg6dgzC8Hwh1R1uLwtzXnGjwZxRkdS8ewV1c8NEu52Jff9XoQRlXOYrLFCkC1vDKNNMTrhterI54xRJZwWBPRfwGyx8Ys9Ev/98KMCFuCy5nvO77glsgS+Ur4vmKvvhQP3qJ8zixNdqX6nvKVsP8hW6ZmRFgJNqTtr7pHR3WmhHCV2D2RPNgzZgD5Kl+04mxQ21/3jPWlRgkuGQTw867ShtFQySPb4V8PzIiw4/Cdkb78id7P7x93XCkFu3Tr0KWbByJLjqd8X/m+8pUgIl+w6qHjqc0VfdmTPTti7bieowQHbu8ev2c4dBzp+47vS99XvuSWyJd88iGCz9aWuZkpLYJkQM67o6/y7VPM3vF050haV+vmBFs/Ev1zdzkv2XUdNScHrjHmb3aNDKfmprl1TYojcO/sqzxV1u9pCYquuqatZk2N2zWRPFSKhlJrM3tdMd/qucNp+pUdw67gfz6v3lMi1rOwz22mWprAuMNsObm3r7K5opFmTcLxJH94NNwWZ7ti/Z2BStfaE67fMbTuwITD0ZeZ2+bVK8kfKSU/3l++azDcvKL1/+we/YvOuvPqveuf7KlrDMbK6YZQ/2xpy7nP9tUzXjL2obH4DyvbXcGOLrtPFzPV0omlZsXXtAbv3Dby/YHKymKuYokI1zbnLih4i/JO2eDxUriuN/zakqbkLSd/d3FzX2p1rB9Z1vyzlW1bS9FoYjpcpTgjAJ7qX91+y8KG9eV0/XBlazk7v8lfVOM+2Vd5rhQLNQuLfKaELTBucNu8go2zohJ/dkJtYmlPpJc83ftcmJ4SqBoBYhwEyTkApxo8MaY4y3MGyaslYgAZAMFcyesF8zjXBBDtjbIL693PLmlqc2WW/YkCxlQxM8KMJZai0ahZifvPbLtzUdOgptFKSkBisT+xmyfS0oReHqhr2nM3vzDo/Xb3jVuHagRDpCeMHdIWkbZAT5yNG5tYQkUbQz2JOVCOzyp4S2qdJ0ej+wcqOyLd5slX602dFqbda/kKvkQOw0k1zml556yGXIsrjDbLa53LGoMrGr2uUC/OqQ/MqV1T4767OUeMluTUzZ31RcVPyKu1dX6D4Itq3DNr3JN8eUGdd6IrF9Q4K+q8BslPr3Xe2BBc0xyMpCbg/KZibdERlqbtac9Cr+XhsEQ5KeAoJGnFWAYESkCJMNSBO5mCBBBF+tBmBmijjVWeY2ItOODIJNKur6ANCHBUGCXV9rcwTKtPAwBjwyQ7Dn91toMHguRMMiSz4SU5jImqTz57mOUknuepdUOV5U929WjryclGG8XgK+5XD6s7BxX3JecMBPiC+4L7kruc+ZxV/+0L5nnyIzuHTtvY7QvuKz75lzMiEtUHCu4L7jI2w6mdkR1mnO+Lsy3DcWiIcUYETzIu+IvjSY3iJwQqTsyEpb1hViv5XF8kGfVoU8MxqCnHmeQMsKPazvWEslhd7xVzjiaMp5aBRrQ9yZdKCMWxN8wczpRgLsGdduPO7BEGKC8YXCEZQFAChuFDWwcfHooEY/9vQeEDHTUXb+p5oZyF1n5ubt0tc+vWPtM/nphSlP7w1JaHx9P7BypjGS3Lq6fOaB9M7bZQj2dm+eb+CW1KkbmoJffb5W3f6xr7yIuDrq/8zPztosZrO+qi+DU2s/wJzGZ4qFz5wGD0oz2lT3TWtXvyg5t6bWY/P6/w2c6aJkfc3j1RSs3+ij4pcH5+RvHieu/+4ejUvHf3kqbn+iubJ5JubX83mlhQ14S+uil3+8LCQ/2VzaXKp/eW3t6au3thQ6msh7V5zXrSn8YsOB4A5nkCUgLqQEYQoj/OzqtzP7igsKWc/ENXeVeYzfVU0RHVi9/fmntXW32bK8cye3HBe09HLXwVEnzG6mS1x5yuacndXKxlLu/TtqzN5c25q9rr4BzjlwOmixkSZhkRouzKrcPve67v+hf7mjiBYdCQw/navNOTmn/aMdwWyAlr91Z3ESdmT5IBlixB2z1xhiRDkhnQcGa7qr8VkJi9cbYvzijMTvHV1a35G58bXPLEATCWE/+p+4fJ2iWBc05bfluok8w6HF/pbL/7jJZPbx99lOjT8+oubAiuXdz0g+6JRodf1xII4PwW/zRfkrUZ8KYm/8y8MsAbWoNGyc/Mq8T4DmPnNgdzHe4Ldk6T53P+3ZMblrh8jLB1OBzPZirjmdphVzAuqp2P1SkAcwS0AQMEN5qEZEYb4QhkNjbkKQ5DkSWqdk1aiiz5iuvMKsbAWZJZV3JjbEZwFbeM37x9cFM5dTl/dDTasrq4rMaN0qk61bOcxCMGbUkBRJO10JQIceZzRoQ4MwQoDcWYTg0DI8BkZA5ebgwZEACbkSEQiBtYwFjKCASQIcbs25pyg5EJLT22sn1ZjRsn2Uz01uykaV8/EFHgSggOEAwdvkt5KnhtCf+XYotqbSk1L+8vmGaF6Wg6x/jxoeMe3H8L/H9hWifXWZ29FQAAAABJRU5ErkJggg==";

const Message = {
    train_label_1: {
        en: "train label 1",
    },
    train_label_2: {
        en: "train label 2",
    },
    train_label_3: {
        en: "train label 3",
    },
    train: {
        en: "train label [LABEL]",
    },
    when_received_block: {
        en: "when received label:[LABEL]",
    },
    label_block: {
        en: "label",
    },
    counts_label_1: {
        en: "counts of label 1",
    },
    counts_label_2: {
        en: "counts of label 2",
    },
    counts_label_3: {
        en: "counts of label 3",
    },
    counts_label_4: {
        en: "counts of label 4",
    },
    counts_label_5: {
        en: "counts of label 5",
    },
    counts_label_6: {
        en: "counts of label 6",
    },
    counts_label_7: {
        en: "counts of label 7",
    },
    counts_label_8: {
        en: "counts of label 8",
    },
    counts_label_9: {
        en: "counts of label 9",
    },
    counts_label_10: {
        en: "counts of label 10",
    },
    counts_label: {
        en: "counts of label [LABEL]",
    },
    any: {
        en: "any",
    },
    all: {
        en: "all",
    },
    reset: {
        en: "reset label:[LABEL]",
    },
    download_learning_data: {
        en: "download learning data",
    },
    upload_learning_data: {
        en: "upload learning data",
    },
    upload: {
        en: "upload",
    },
    uploaded: {
        en: "The upload is complete.",
    },
    upload_instruction: {
        en: "Select a file and click the upload button.",
    },
    confirm_reset: {
        en: "Are you sure to reset?",
    },
    toggle_classification: {
        en: "turn classification [CLASSIFICATION_STATE]",
    },
    set_classification_interval: {
        en: "Label once every [CLASSIFICATION_INTERVAL] seconds",
    },
    video_toggle: {
        en: "turn video [VIDEO_STATE]",
    },
    set_input: {
        en: "Learn/Classify [INPUT] image",
    },
    on: {
        en: "on",
    },
    off: {
        en: "off",
    },
    video_on_flipped: {
        en: "on flipped",
    },
    webcam: {
        en: "webcam",
    },
    stage: {
        en: "stage",
    },
    backdrop: {
        en: "backdrop",
    },
    first_training_warning: {
        en: "The first training will take a while, so do not click again and again.",
    },
};

class Scratch3MLScratchBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        if (runtime.formatMessage) {
            formatMessage = runtime.formatMessage;
        }

        this.when_received = false;
        this.when_received_arr = Array(8).fill(false);
        this.label = null;
        this.locale = "en";

        this.blockClickedAt = null;

        this.counts = null;
        this.firstTraining = true;

        this.interval = 1000;
        this.globalVideoTransparency = 0;
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency,
        });

        this.canvas = document.querySelector("canvas");

        this.runtime.ioDevices.video.enableVideo().then(() => {
            this.input = this.runtime.ioDevices.video.provider.video;
        });

        this.knnClassifier = ml5.KNNClassifier();
        this.featureExtractor = ml5.featureExtractor("MobileNet", () => {
            console.log("[featureExtractor] Model Loaded!");
            this.timer = setInterval(() => {
                this.classify();
            }, this.interval);
        });
    }
    get EXTENSION_ID() {
        return "ml";
    }

    getInfo() {
        return [
            {
                id: "ml",
                name: formatMessage({
                    id: "ml.categoryName",
                    default: "ML",
                    description: "Name of the ML extension category",
                }),
                blockIconURI: blockIconURI,
                blocks: [
                    {
                        opcode: "addExample1",
                        blockType: BlockType.COMMAND,
                        text: Message.train_label_1[this.locale],
                    },
                    {
                        opcode: "addExample2",
                        blockType: BlockType.COMMAND,
                        text: Message.train_label_2[this.locale],
                    },
                    {
                        opcode: "addExample3",
                        blockType: BlockType.COMMAND,
                        text: Message.train_label_3[this.locale],
                    },
                    {
                        opcode: "train",
                        text: Message.train[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                menu: "train_menu",
                                defaultValue: "4",
                            },
                        },
                    },
                    {
                        opcode: "trainAny",
                        text: Message.train[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "11",
                            },
                        },
                    },
                    {
                        opcode: "getLabel",
                        text: Message.label_block[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "whenReceived",
                        text: Message.when_received_block[this.locale],
                        blockType: BlockType.HAT,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                menu: "received_menu",
                                defaultValue: "any",
                            },
                        },
                    },
                    {
                        opcode: "whenReceivedAny",
                        text: Message.when_received_block[this.locale],
                        blockType: BlockType.HAT,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "11",
                            },
                        },
                    },
                    {
                        opcode: "getCountByLabel1",
                        text: Message.counts_label_1[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel2",
                        text: Message.counts_label_2[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel3",
                        text: Message.counts_label_3[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel4",
                        text: Message.counts_label_4[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel5",
                        text: Message.counts_label_5[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel6",
                        text: Message.counts_label_6[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel7",
                        text: Message.counts_label_7[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel8",
                        text: Message.counts_label_8[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel9",
                        text: Message.counts_label_9[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel10",
                        text: Message.counts_label_10[this.locale],
                        blockType: BlockType.REPORTER,
                    },
                    {
                        opcode: "getCountByLabel",
                        text: Message.counts_label[this.locale],
                        blockType: BlockType.REPORTER,
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "11",
                            },
                        },
                    },
                    {
                        opcode: "reset",
                        blockType: BlockType.COMMAND,
                        text: Message.reset[this.locale],
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                menu: "reset_menu",
                                defaultValue: "all",
                            },
                        },
                    },
                    {
                        opcode: "resetAny",
                        blockType: BlockType.COMMAND,
                        text: Message.reset[this.locale],
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: "11",
                            },
                        },
                    },
                    {
                        opcode: "download",
                        text: Message.download_learning_data[this.locale],
                        blockType: BlockType.COMMAND,
                    },
                    {
                        opcode: "upload",
                        text: Message.upload_learning_data[this.locale],
                        blockType: BlockType.COMMAND,
                    },
                    {
                        opcode: "toggleClassification",
                        text: Message.toggle_classification[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            CLASSIFICATION_STATE: {
                                type: ArgumentType.STRING,
                                menu: "classification_menu",
                                defaultValue: "off",
                            },
                        },
                    },
                    {
                        opcode: "setClassificationInterval",
                        text: Message.set_classification_interval[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            CLASSIFICATION_INTERVAL: {
                                type: ArgumentType.STRING,
                                menu: "classification_interval_menu",
                                defaultValue: "1",
                            },
                        },
                    },
                    {
                        opcode: "videoToggle",
                        text: Message.video_toggle[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VIDEO_STATE: {
                                type: ArgumentType.STRING,
                                menu: "video_menu",
                                defaultValue: "off",
                            },
                        },
                    },
                    {
                        opcode: "setVideoTransparency",
                        text: formatMessage({
                            id: "videoSensing.setVideoTransparency",
                            default: "set video transparency to [TRANSPARENCY]",
                            description:
                                "Controls transparency of the video preview layer",
                        }),
                        arguments: {
                            TRANSPARENCY: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        },
                    },
                    {
                        opcode: "setInput",
                        text: Message.set_input[this.locale],
                        blockType: BlockType.COMMAND,
                        arguments: {
                            INPUT: {
                                type: ArgumentType.STRING,
                                menu: "input_menu",
                                defaultValue: "webcam",
                            },
                        },
                    },
                ],
                menus: {
                    received_menu: {
                        items: this.getMenu("received"),
                    },
                    reset_menu: {
                        items: this.getMenu("reset"),
                    },
                    train_menu: {
                        items: this.getTrainMenu(),
                    },
                    count_menu: {
                        items: this.getTrainMenu(),
                    },
                    video_menu: this.getVideoMenu(),
                    classification_interval_menu: {
                        acceptReporters: true,
                        items: this.getClassificationIntervalMenu(),
                    },
                    classification_menu: this.getClassificationMenu(),
                    input_menu: this.getInputMenu(),
                },
            },
        ];
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 0;
    }

    set globalVideoTransparency(transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    addExample1() {
        this.firstTrainingWarning();
        let features = this.featureExtractor.infer(this.input);
        this.knnClassifier.addExample(features, "1");
        this.updateCounts();
    }

    addExample2() {
        this.firstTrainingWarning();
        let features = this.featureExtractor.infer(this.input);
        this.knnClassifier.addExample(features, "2");
        this.updateCounts();
    }

    addExample3() {
        this.firstTrainingWarning();
        let features = this.featureExtractor.infer(this.input);
        this.knnClassifier.addExample(features, "3");
        this.updateCounts();
    }

    train(args) {
        this.firstTrainingWarning();
        let features = this.featureExtractor.infer(this.input);
        this.knnClassifier.addExample(features, args.LABEL);
        this.updateCounts();
    }

    trainAny(args) {
        this.train(args);
    }

    getLabel() {
        return this.label;
    }

    whenReceived(args) {
        if (args.LABEL === "any") {
            if (this.when_received) {
                setTimeout(() => {
                    this.when_received = false;
                }, HAT_TIMEOUT);
                return true;
            }
            return false;
        } else {
            if (this.when_received_arr[args.LABEL]) {
                setTimeout(() => {
                    this.when_received_arr[args.LABEL] = false;
                }, HAT_TIMEOUT);
                return true;
            }
            return false;
        }
    }

    whenReceivedAny(args) {
        return this.whenReceived(args);
    }

    getCountByLabel1() {
        if (this.counts) {
            return this.counts["1"];
        } else {
            return 0;
        }
    }

    getCountByLabel2() {
        if (this.counts) {
            return this.counts["2"];
        } else {
            return 0;
        }
    }

    getCountByLabel3() {
        if (this.counts) {
            return this.counts["3"];
        } else {
            return 0;
        }
    }

    getCountByLabel4() {
        if (this.counts) {
            return this.counts["4"];
        } else {
            return 0;
        }
    }

    getCountByLabel5() {
        if (this.counts) {
            return this.counts["5"];
        } else {
            return 0;
        }
    }

    getCountByLabel6() {
        if (this.counts) {
            return this.counts["6"];
        } else {
            return 0;
        }
    }

    getCountByLabel7() {
        if (this.counts) {
            return this.counts["7"];
        } else {
            return 0;
        }
    }

    getCountByLabel8() {
        if (this.counts) {
            return this.counts["8"];
        } else {
            return 0;
        }
    }

    getCountByLabel9() {
        if (this.counts) {
            return this.counts["9"];
        } else {
            return 0;
        }
    }

    getCountByLabel10() {
        if (this.counts) {
            return this.counts["10"];
        } else {
            return 0;
        }
    }

    getCountByLabel(args) {
        if (this.counts[args.LABEL]) {
            return this.counts[args.LABEL];
        } else {
            return 0;
        }
    }

    reset(args) {
        if (this.actionRepeated()) {
            return;
        }

        setTimeout(() => {
            let result = confirm(Message.confirm_reset[this.locale]);
            if (result) {
                if (args.LABEL == "all") {
                    this.knnClassifier.clearAllLabels();
                    for (let label in this.counts) {
                        this.counts[label] = 0;
                    }
                } else {
                    if (this.counts[args.LABEL] > 0) {
                        this.knnClassifier.clearLabel(args.LABEL);
                        this.counts[args.LABEL] = 0;
                    }
                }
            }
        }, 1000);
    }

    resetAny(args) {
        this.reset(args);
    }

    download() {
        if (this.actionRepeated()) {
            return;
        }
        let fileName = String(Date.now());
        this.knnClassifier.save(fileName);
    }

    upload() {
        if (this.actionRepeated()) {
            return;
        }
        let width = 500;
        let height = 500;
        let left = window.innerWidth / 2;
        let top = window.innerHeight / 2;
        let x = left - width / 2;
        let y = top - height / 2;
        const uploadWindow = window.open(
            "",
            null,
            "top=" + y + ",left=" + x + ",width=" + width + ",height=" + height
        );
        uploadWindow.document.open();
        uploadWindow.document.write(
            "<html><head><title>" +
                Message.upload_learning_data.en +
                "</title></head><body>"
        );
        uploadWindow.document.write(
            "<p>" + Message.upload_instruction.en + "</p>"
        );
        uploadWindow.document.write('<input type="file" id="upload-files">');
        uploadWindow.document.write(
            '<input type="button" value="' +
                Message.upload.en +
                '" id="upload-button">'
        );
        uploadWindow.document.write("</body></html>");
        uploadWindow.document.close();

        uploadWindow.document.getElementById("upload-button").onclick = () => {
            this.uploadButtonClicked(uploadWindow);
        };
    }

    toggleClassification(args) {
        let state = args.CLASSIFICATION_STATE;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (state === "on") {
            this.timer = setInterval(() => {
                this.classify();
            }, this.interval);
        }
    }

    setClassificationInterval(args) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.interval = args.CLASSIFICATION_INTERVAL * 1000;
        this.timer = setInterval(() => {
            this.classify();
        }, this.interval);
    }

    videoToggle(args) {
        let state = args.VIDEO_STATE;
        if (state === "off") {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo().then(() => {
                this.input = this.runtime.ioDevices.video.provider.video;
            });
            this.runtime.ioDevices.video.mirror = state === "on";
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }

    setInput(args) {
        let input = args.INPUT;
        if (input === "webcam") {
            this.input = this.runtime.ioDevices.video.provider.video;
        } else {
            this.input = this.canvas;
        }
    }

    uploadButtonClicked(uploadWindow) {
        let files = uploadWindow.document.getElementById("upload-files").files;

        if (files.length <= 0) {
            uploadWindow.alert("Please select JSON file.");
            return false;
        }

        let fr = new FileReader();

        fr.onload = (e) => {
            let data = JSON.parse(e.target.result);
            this.knnClassifier.load(data, () => {
                console.log("uploaded!");

                this.updateCounts();
                alert(Message.uploaded[this.locale]);
            });
        };

        fr.onloadend = (e) => {
            uploadWindow.document.getElementById("upload-files").value = "";
        };

        fr.readAsText(files.item(0));
        uploadWindow.close();
    }

    classify() {
        let numLabels = this.knnClassifier.getNumLabels();
        if (numLabels == 0) return;

        let features = this.featureExtractor.infer(this.input);
        this.knnClassifier.classify(features, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                this.label = this.getTopConfidenceLabel(
                    result.confidencesByLabel
                );
                this.when_received = true;
                this.when_received_arr[this.label] = true;
            }
        });
    }

    getTopConfidenceLabel(confidences) {
        let topConfidenceLabel;
        let topConfidence = 0;

        for (let label in confidences) {
            if (confidences[label] > topConfidence) {
                topConfidenceLabel = label;
            }
        }

        return topConfidenceLabel;
    }

    updateCounts() {
        this.counts = this.knnClassifier.getCountByLabel();
        console.debug(this.counts);
    }

    actionRepeated() {
        let currentTime = Date.now();
        if (this.blockClickedAt && this.blockClickedAt + 250 > currentTime) {
            console.log("Please do not repeat trigerring this block.");
            this.blockClickedAt = currentTime;
            return true;
        } else {
            this.blockClickedAt = currentTime;
            return false;
        }
    }

    getMenu(name) {
        let arr = [];
        let defaultValue = "any";
        let text = Message.any[this.locale];
        if (name == "reset") {
            defaultValue = "all";
            text = Message.all[this.locale];
        }
        arr.push({ text: text, value: defaultValue });
        for (let i = 1; i <= 10; i++) {
            let obj = {};
            obj.text = i.toString(10);
            obj.value = i.toString(10);
            arr.push(obj);
        }
        return arr;
    }

    getTrainMenu() {
        let arr = [];
        for (let i = 4; i <= 10; i++) {
            let obj = {};
            obj.text = i.toString(10);
            obj.value = i.toString(10);
            arr.push(obj);
        }
        return arr;
    }

    getVideoMenu() {
        return [
            {
                text: Message.off[this.locale],
                value: "off",
            },
            {
                text: Message.on[this.locale],
                value: "on",
            },
            {
                text: Message.video_on_flipped[this.locale],
                value: "on-flipped",
            },
        ];
    }

    getInputMenu() {
        return [
            {
                text: Message.webcam[this.locale],
                value: "webcam",
            },
            {
                text: Message.stage[this.locale],
                value: "stage",
            },
            {
                text: Message.backdrop[this.locale],
                value: "backdrop",
            },
        ];
    }

    getClassificationIntervalMenu() {
        return [
            {
                text: "1",
                value: "1",
            },
            {
                text: "0.5",
                value: "0.5",
            },
            {
                text: "0.2",
                value: "0.2",
            },
            {
                text: "0.1",
                value: "0.1",
            },
        ];
    }

    getClassificationMenu() {
        return [
            {
                text: Message.off[this.locale],
                value: "off",
            },
            {
                text: Message.on[this.locale],
                value: "on",
            },
        ];
    }

    firstTrainingWarning() {
        if (this.firstTraining) {
            alert(Message.first_training_warning[this.locale]);
            this.firstTraining = false;
        }
    }
}

module.exports = Scratch3MLScratchBlocks;
